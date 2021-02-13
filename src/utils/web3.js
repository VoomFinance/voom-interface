import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { rcp, multicallAddr, usdt, voom } from '../config/configs'
import Web3 from "web3"
import abiToken from '../assets/abi/Token'
import abiVoom from '../assets/abi/Voom'
import abiMulticall from '../assets/abi/Multicall'
import BigNumber from 'bignumber.js'
import { Interface } from '@ethersproject/abi'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export const getRevertReason = async (txHash) => {
    try {
        const tx = await window.web3.eth.getTransaction(txHash)
        var result = await window.web3.eth.call(tx, tx.blockNumber)
        result = result.startsWith('0x') ? result : `0x${result}`
        if (result && result.substr(138)) {
            const reason = window.web3.utils.toAscii(result.substr(138))
            return reason
        } else {
            return "Cannot get reason - No return value"
        }
    } catch (error) {
        return "Cannot get reason - No return value"
    }
}


export const Web3ContractsProvider = (dispatch) => {
    dispatch({ type: 'CHANGE_WEB3', payload: true })
    dispatch({ type: 'INTERFACE_TOKEN', payload: (new window.web3.eth.Contract(abiToken, usdt)) })
    dispatch({ type: 'INTERFACE_VOOM', payload: (new window.web3.eth.Contract(abiVoom, voom)) })
}

export const Web3Init = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const init = async () => {
            try {
                window.web3Read = new Web3(rcp)
                if (window.web3Read.currentProvider.host === rcp) {
                    dispatch({ type: 'CHANGE_WEB3', payload: true })
                    dispatch({ type: 'INTERFACE_TOKEN', payload: (new window.web3Read.eth.Contract(abiToken, usdt)) })
                    dispatch({ type: 'INTERFACE_VOOM', payload: (new window.web3Read.eth.Contract(abiVoom, voom)) })
                }
            } catch (error) {

            }
        }
        init()
    }, [dispatch])
    return <></>
}

export const autoMetamask = async () => {
    let check = false
    if (typeof window.web3 !== "undefined") {
        await new Promise(async (resolve, reject) => {
            setTimeout(function () {
                resolve()
            }, 450)
        })
        if (window.ethereum && (await window.ethereum.isConnected()) === true) {
            try {
                window.web3 = new Web3(window.ethereum)
                check = true
            } catch (e) {
                window.web3 = null
            }
        }
    }
    return check
}

export const autoBinanceSmartChain = async () => {
    let check = false
    if (typeof window.web3 !== "undefined") {
        await new Promise(async (resolve, reject) => {
            setTimeout(function () {
                resolve()
            }, 450)
        })
        if (window.BinanceChain && (await window.BinanceChain.isConnected()) === true) {
            try {
                window.web3 = new Web3(window.BinanceChain)
                check = true
            } catch (e) {
                window.web3 = null
            }
        }
    }
    return check
}

export const getAddress = async () => {
    let addr = null
    try {
        await window.web3.eth.getAccounts().then(async result => {
            window.web3.eth.defaultAccount = result[0]
            addr = result[0]
        }).catch(() => addr = null)
    } catch (error) {
        addr = null
    }
    return addr
}

export const newBlock = (dispatch) => {
    window.web3.eth.subscribe("newBlockHeaders", (error, event) => {
        if (error) return
        dispatch({ type: 'NEW_BLOCK', payload: event.number })
        dispatch({ type: 'NEW_BLOCK_TIME', payload: parseFloat(event.timestamp) })
        dispatch({ type: 'CHANGE_RELOAD', payload: Math.random() })
    })
}

export const BlockLast = (dispatch) => {
    window.web3Read.eth.getBlockNumber().then((event) => {
        dispatch({ type: 'NEW_BLOCK', payload: parseFloat(event) })
    })
}

export const accountsChanged = (dispatch) => {
    try {
        window.ethereum.on('accountsChanged', (result) => {
            if (result.length > 0) {
                dispatch({ type: 'CHANGE_ADDRESS', payload: result[0] })
                localStorage.setItem(result[0], true);
            } else {
                dispatch({ type: 'CHANGE_CONNECTED', payload: false })
                dispatch({ type: "CHANGE_METAMASK", payload: false })
                dispatch({ type: 'CHANGE_ADDRESS', payload: null })
            }
        })
        window.BinanceChain.on('accountsChanged', (result) => {
            if (result.length > 0) {
                dispatch({ type: 'CHANGE_ADDRESS', payload: result[0] })
                localStorage.setItem(result[0], true);
            } else {
                dispatch({ type: 'CHANGE_CONNECTED', payload: false })
                dispatch({ type: "CHANGE_METAMASK", payload: false })
                dispatch({ type: 'CHANGE_ADDRESS', payload: null })
            }
        })
    } catch (error) {
        return
    }
}

export const Web3Auto = () => {
    const dispatch = useDispatch()
    const [hasRendered, setHasRendered] = useState(false)
    const _web3 = useSelector(store => store.web3.web3)
    useEffect(() => {
        if (!hasRendered && _web3 === true) {
            const checkAddress = async () => {
                let addr = await getAddress()
                if (addr !== null && addr !== undefined && localStorage.getItem(addr) === 'true') {
                    dispatch({ type: 'CHANGE_ADDRESS', payload: addr })
                    dispatch({ type: 'CHANGE_METAMASK', payload: true })
                    newBlock(dispatch)
                    accountsChanged(dispatch)
                    return true
                }
                return null
            }
            const init = async () => {
                await BlockLast(dispatch)
                let statusWeb3 = false
                if (statusWeb3 === false && await autoMetamask() === true) {
                    dispatch({ type: 'CHANGE_NETWORK', payload: 'eth' })
                    if (await checkAddress() === true) {
                        dispatch({ type: 'CHANGE_CONNECTED', payload: true })
                        Web3ContractsProvider(dispatch)
                        statusWeb3 = true
                    } else {
                        dispatch({ type: 'CHANGE_CONNECTED', payload: false })
                        dispatch({ type: "CHANGE_METAMASK", payload: false })
                    }
                }
                if (statusWeb3 === false){
                    const wc = localStorage.getItem('WALLECTCONNECT')                
                    if (wc !== null && wc !== undefined) {
                        let connector = new WalletConnect({
                            bridge: "https://bridge.walletconnect.org",
                            qrcodeModal: QRCodeModal
                          })
                          if (connector.connected) {
                            dispatch({ type: "CHANGE_ADDRESS", payload: wc });
                            dispatch({ type: "CHANGE_CONNECTED", payload: true });
                            dispatch({ type: "CHANGE_METAMASK", payload: true });
                            dispatch({ type: "CHANGE_WALLECTCONNECT", payload: connector });
                          }
                    }
                }
                /*if (statusWeb3 === false && await autoBinanceSmartChain() === true) {
                    dispatch({ type: 'CHANGE_NETWORK', payload: 'bsc' })
                    if (await checkAddress() === true) {
                        dispatch({ type: 'CHANGE_CONNECTED', payload: true })
                        Web3ContractsProvider(dispatch)
                        statusWeb3 = true
                    } else {
                        dispatch({ type: 'CHANGE_CONNECTED', payload: false })
                        dispatch({ type: "CHANGE_METAMASK", payload: false })
                    }
                }*/
                if (statusWeb3 === false) {
                    dispatch({ type: 'CHANGE_CONNECTED', payload: false })
                }
            }
            init()
            setHasRendered(true)
        }
    }, [dispatch, hasRendered, _web3])
    return <></>
}

export const nf = (n) => {
    n = ((n * 1).toFixed(4))
    var s = n.toString();
    if (s.indexOf('.') === -1) s += '.';
    while (s.length < s.indexOf('.') + 5) s += '0';
    let e = s.split(".")
    if (e.length > 1) {
        let p = (new BigNumber(e[0] * 1)).toNumber().toLocaleString('en-US')
        s = p + '.' + e[1]
    }
    return s
}

export const nfu = (n) => {
    n = ((n * 1).toFixed(2))
    var s = n.toString();
    if (s.indexOf('.') === -1) s += '.';
    while (s.length < s.indexOf('.') + 3) s += '0';
    let e = s.split(".")
    if (e.length > 1) {
        let p = (new BigNumber(e[0] * 1)).toNumber().toLocaleString('en-US')
        s = p + '.' + e[1]
    }
    return s
}

export const multicall = async (web3, abi, calls) => {
    const multi = new web3.eth.Contract(abiMulticall, multicallAddr)
    const itf = new Interface(abi)
    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
    const { returnData } = await multi.methods.aggregate(calldata).call()
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
    return res
}
