import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { nf, getRevertReason } from '../utils/web3'
import { gas, voom as _voom } from '../config/configs'
import BigNumber from 'bignumber.js'
import abiVoom from '../assets/abi/Voom'
import useRefresh from "../utils/useRefresh";

const Claim = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isConnected = useSelector((store) => store.web3.isConnected);
    const address = useSelector((store) => store.web3.address);
    const token = useSelector((store) => store.web3.token);
    const voomContract = useSelector((store) => store.web3.voom);
    const { addToast } = useToasts();
    const [balance, set_balance] = useState(0);
    const [reload, set_reload] = useState(0);
    const [loading_claim, set_loading_claim] = useState(false)
    const [loading_reinvest, set_loading_reinvest] = useState(false)
    const [loading_compound, set_loading_compound] = useState(false)
    const [paused, set_paused] = useState(false)
    const [is_member, set_is_member] = useState(false)
    const [hash, set_hash] = useState(null)
    const walletconnect = useSelector((store) => store.web3.walletconnect);
    const { fastRefresh } = useRefresh()

    useEffect(() => {
        if (isConnected && address !== null && token !== null) {       
            voomContract.methods.pendingReward(address).call().then(async (result) => {
                set_balance(new BigNumber(result).div(new BigNumber(10).pow(18)))
            })
            voomContract.methods.paused().call().then(async (result) => {
                set_paused(result)
            })
            voomContract.methods.isMember(address).call().then(async (result) => {
                set_is_member(result)
            })
        } else {
            set_balance(0)
        }
    }, [isConnected, address, token, reload, fastRefresh, voomContract])

    const Claim = async () => {
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (!is_member) {
            addToast(t("You do not have any investment to perform the action"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        set_loading_claim(true)
        set_hash(null)
        if (walletconnect === null) {
            try {
                await voomContract.methods.harvest().send({
                    from: address,
                    value: 0,
                    gas: 0,
                    gasPrice: gas
                }).on("transactionHash", async h => {
                    set_hash(h)
                    dispatch({
                        type: 'DATA_TOAST', payload: {
                            title: "executing transaction",
                            subtitle: "Vault",
                            value: "The transaction is running on the BSC blockchain",
                            hash: h
                        }
                    })
                    dispatch({ type: 'SHOW_TOAST', payload: true })
                }).on('receipt', async (receipt) => {
                    set_loading_claim(false)
                    dispatch({ type: 'SHOW_TOAST', payload: false })
                    if (receipt.status) {
                        addToast(t('The transaction is successfully confirmed.'), {
                            appearance: 'success',
                            autoDismiss: true,
                        })
                        set_reload(Math.random())
                    } else {
                        addToast(t('An error occurred, try again!'), {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    }
                }).on("error", async (error) => {
                    set_loading_claim(false)
                    let msg = t('An error occurred, try again!')
                    if (hash !== null) {
                        msg = await getRevertReason(hash)
                    }
                    addToast(msg, {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
            } catch (error) {
                set_loading_claim(false)
            }
        } else {
            const contract = new window.web3Read.eth.Contract(abiVoom, _voom)
            const tx = {
                from: address,
                to: _voom,
                data: contract.methods.harvest().encodeABI(),
                gasPrice: gas,
            }
            walletconnect.sendTransaction(tx)
                .then((result) => {
                    set_loading_claim(false)
                    addToast(t('The transaction is successfully confirmed.'), {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    set_reload(Math.random())
                }).catch((error) => {
                    set_loading_claim(false)
                    addToast(t('An error occurred, try again!'), {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
        }
    }

    const Reinvest = async () => {
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (!is_member) {
            addToast(t("You do not have any investment to perform the action"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (paused) {
            addToast(t("Reinvests are paused at the moment, but you can claim your winnings"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        set_loading_reinvest(true)
        set_hash(null)
        if (walletconnect === null) {
            try {
                await voomContract.methods.reinvestment().send({
                    from: address,
                    value: 0,
                    gas: 0,
                    gasPrice: gas
                }).on("transactionHash", async h => {
                    set_hash(h)
                    dispatch({
                        type: 'DATA_TOAST', payload: {
                            title: "executing transaction",
                            subtitle: "Vault",
                            value: "The transaction is running on the BSC blockchain",
                            hash: h
                        }
                    })
                    dispatch({ type: 'SHOW_TOAST', payload: true })
                }).on('receipt', async (receipt) => {
                    set_loading_reinvest(false)
                    dispatch({ type: 'SHOW_TOAST', payload: false })
                    if (receipt.status) {
                        addToast(t('The transaction is successfully confirmed.'), {
                            appearance: 'success',
                            autoDismiss: true,
                        })
                        set_reload(Math.random())
                        dispatch({ type: 'CHANGE_REINVEST', payload: Math.random() })
                    } else {
                        addToast(t('An error occurred, try again!'), {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    }
                }).on("error", async (error) => {
                    set_loading_reinvest(false)
                    let msg = t('An error occurred, try again!')
                    if (hash !== null) {
                        msg = await getRevertReason(hash)
                    }
                    addToast(msg, {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
            } catch (error) {
                set_loading_reinvest(false)
            }
        } else {
            const contract = new window.web3Read.eth.Contract(abiVoom, _voom)
            const tx = {
                from: address,
                to: _voom,
                data: contract.methods.reinvestment().encodeABI(),
                gasPrice: gas,
            }
            walletconnect.sendTransaction(tx)
                .then((result) => {
                    set_loading_reinvest(false)
                    addToast(t('The transaction is successfully confirmed.'), {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    set_reload(Math.random())
                }).catch((error) => {
                    set_loading_reinvest(false)
                    addToast(t('An error occurred, try again!'), {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
        }
    }

    const Compound = async () => {
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (!is_member) {
            addToast(t("You do not have any investment to perform the action"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (paused) {
            addToast(t("Reinvests are paused at the moment, but you can claim your winnings"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        set_loading_compound(true)
        set_hash(null)
        if (walletconnect === null) {
            try {
                await voomContract.methods.reinvestmentEnter().send({
                    from: address,
                    value: 0,
                    gas: 0,
                    gasPrice: gas
                }).on("transactionHash", async h => {
                    set_hash(h)
                    dispatch({
                        type: 'DATA_TOAST', payload: {
                            title: "executing transaction",
                            subtitle: "Vault",
                            value: "The transaction is running on the BSC blockchain",
                            hash: h
                        }
                    })
                    dispatch({ type: 'SHOW_TOAST', payload: true })
                }).on('receipt', async (receipt) => {
                    set_loading_compound(false)
                    dispatch({ type: 'SHOW_TOAST', payload: false })
                    if (receipt.status) {
                        addToast(t('The transaction is successfully confirmed.'), {
                            appearance: 'success',
                            autoDismiss: true,
                        })
                        set_reload(Math.random())
                        dispatch({ type: 'CHANGE_REINVEST', payload: Math.random() })
                    } else {
                        addToast(t('An error occurred, try again!'), {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    }
                }).on("error", async (error) => {
                    set_loading_compound(false)
                    let msg = t('An error occurred, try again!')
                    if (hash !== null) {
                        msg = await getRevertReason(hash)
                    }
                    addToast(msg, {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
            } catch (error) {
                set_loading_compound(false)
            }
        } else {
            const contract = new window.web3Read.eth.Contract(abiVoom, _voom)
            const tx = {
                from: address,
                to: _voom,
                data: contract.methods.reinvestmentEnter().encodeABI(),
                gasPrice: gas,
            }
            walletconnect.sendTransaction(tx)
                .then((result) => {
                    set_loading_compound(false)
                    addToast(t('The transaction is successfully confirmed.'), {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    set_reload(Math.random())
                }).catch((error) => {
                    set_loading_compound(false)
                    addToast(t('An error occurred, try again!'), {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
        }
    }    

    return (
        <>
            <div className="hyACfo">
                <div className="lmkiK">
                    <div className="cwXnKl">
                        <div className="cfevtU">
                            <div className="hbOhGN">
                                <div className="jlrkvw">💰</div>
                                <div className="fNiHrC">{nf(balance)}</div>
                                <div className="idGrgN">{t("Unclaimed earnings")}</div>
                            </div>
                            <div className="iftTHE">
                                {loading_claim === false && <button color="#664200" size="56" className="ieRJEt" onClick={() => Claim()}>{t("Claim")}</button>}
                                {loading_claim === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                                <div size="12" className="separador_vault"></div>
                                {loading_reinvest === false && <button color="#664200" size="56" className="ieRJEt" onClick={Reinvest}>{t("Reinvest")}</button>}
                                {loading_reinvest === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                                <div size="12" className="separador_vault"></div>
                                {loading_compound === false && <button color="#664200" size="56" className="ieRJEt" onClick={Compound}>{t("Compound")}</button>}
                                {loading_compound === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withRouter(Claim);
