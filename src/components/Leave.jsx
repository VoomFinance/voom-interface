import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { nf, getRevertReason } from '../utils/web3'
import { voom, gas } from '../config/configs'
import { Modal } from 'react-bootstrap';
import BigNumber from 'bignumber.js'
import abiVoom from '../assets/abi/Voom'
import useRefresh from "../utils/useRefresh";

const Leave = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isConnected = useSelector((store) => store.web3.isConnected);
    const address = useSelector((store) => store.web3.address);
    const token = useSelector((store) => store.web3.token);
    const voomContract = useSelector((store) => store.web3.voom);
    const { addToast } = useToasts();
    const [balance, set_balance] = useState(0);
    const [ratio, set_ratio] = useState(0);
    const [reload, set_reload] = useState(0);
    const [loading_deposit, set_loading_deposit] = useState(false)
    const [show, setShow] = useState(false);
    const [tokens, set_tokens] = useState(0);
    const [maxTokens, set_maxTokens] = useState(0)
    const [maxTokens_ready, set_maxTokens_ready] = useState(0)
    const [isMax, set_isMax] = useState(false)
    const [paused, set_paused] = useState(false)
    const reinvest = useSelector((store) => store.web3.reinvest)
    const [hash, set_hash] = useState(null)
    const walletconnect = useSelector((store) => store.web3.walletconnect)
    const { fastRefresh } = useRefresh()

    useEffect(() => {
        if (isConnected && address !== null && token !== null) {
            window.token = token
            window.address = address
            window.voom = voom
            voomContract.methods.balanceOf(address).call().then(async (result) => {
                set_balance(new BigNumber(result).div(new BigNumber(10).pow(18)))
            })
            voomContract.methods.paused().call().then(async (result) => {
                set_paused(result)
            })
        }
    }, [isConnected, address, token, reload, voomContract])

    useEffect(() => {
        if (isConnected && address !== null && voomContract !== null) {
            voomContract.methods.balanceOf(address).call().then(async (result) => {
                set_balance(new BigNumber(result).div(new BigNumber(10).pow(18)))
            })
            voomContract.methods.xBUSDForBUSD("" + 1e18).call().then(async (result) => {
                set_ratio(new BigNumber(result).div(new BigNumber(10).pow(18)))
            })
        } else {
            set_balance(0)
        }
    }, [isConnected, address, reinvest, voomContract, fastRefresh])

    useEffect(() => {
        if (isConnected && address !== null && voomContract !== null && show === true) {
            set_loading_deposit(false)
            set_tokens("")
            voomContract.methods.balanceOf(address).call().then(async (result) => {
                set_maxTokens_ready(result)
                set_maxTokens(window.web3Read.utils.fromWei(result + '', 'ether'))
            })
        }
    }, [isConnected, address, voomContract, show])



    const Deposit = async () => {
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (paused) {
            addToast(t("Withdraws are paused at the moment, but you can claim your winnings"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (tokens <= 0) {
            addToast(t("Enter the amount of xBUSD you want to withdraw"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        set_loading_deposit(true)
        set_hash(null)
        let totalTokens = window.web3Read.utils.toWei(tokens + '', 'ether')
        if (isMax) {
            totalTokens = maxTokens_ready
        }
        if (walletconnect === null) {
            try {
                await voomContract.methods.leave(totalTokens).send({
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
                    set_loading_deposit(false)
                    setShow(false)
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
                    set_loading_deposit(false)
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
                console.log(error)
                set_loading_deposit(false)
            }
        } else {
            const contract = new window.web3Read.eth.Contract(abiVoom, voom)
            const tx = {
                from: address,
                to: voom,
                data: contract.methods.leave(totalTokens).encodeABI(),
                gasPrice: gas,
            }
            walletconnect.sendTransaction(tx)
                .then((result) => {
                    set_loading_deposit(false)
                    setShow(false)
                    addToast(t('The transaction is successfully confirmed.'), {
                        appearance: 'success',
                        autoDismiss: true,
                    })
                    set_reload(Math.random())

                }).catch((error) => {
                    set_loading_deposit(false)
                    addToast(t('An error occurred, try again!'), {
                        appearance: 'error',
                        autoDismiss: true,
                    })
                })
        }
    }

    const maxTokensAction = async (e) => {
        set_tokens(maxTokens)
        set_isMax(true)
    }

    const changeValueDeposit = async (e) => {
        set_isMax(false)
        const re = /^[0-9-.\b]+$/;
        if (e === '' || re.test(e)) {
            let count = 0
            for (let i = 0; i < e.length; i++) {
                if (e[i] === ".") {
                    count++
                }
            }
            if (count <= 1) {
                set_tokens(e)
            }
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
                                <div className="idGrgN">x{t("BUSD Available")}</div>
                                <span className="mt-2" />
                                <div className="idGrgN">{t("Ratio")} xBUSD / BUSD</div>
                                <div className="idGrgN">{nf(ratio)}</div>
                            </div>
                            <div className="iftTHE">
                                <button color="#664200" size="56" className="ieRJEt" onClick={() => setShow(true)}>{t("Withdraw")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                centered
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                variant="dark"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Body>
                    <div className="bootstrap-wrapper">
                        <>
                            <div className="container-fluid ">
                                <div className="row">
                                    <div className="col-12 connected-center connected-center_disconnect">
                                        <p className="connected_title">{t("Withdraw xBUSD")}</p>
                                        <p className="connected_subtitle">{t("Enter the amount of xBUSD you want to withdraw")}</p>
                                        <div className="cHQGgS">
                                            <span>{nf(maxTokens)}  {t("Available")}</span>
                                        </div>
                                        <div className="gJxTIO">
                                            <input placeholder="0" className="gUVAGu" value={tokens} onChange={e => changeValueDeposit(e.target.value)} />
                                            <div className="bnKPcn">
                                                <span className="ioMJHN"></span>
                                                <div className="jKJqEw"></div>
                                                <div><button color="#664200" size="36" className="fBdKlJ" onClick={maxTokensAction}>Max</button></div>
                                            </div>
                                        </div>
                                        {loading_deposit === false && <button color="#664200" size="56" className="ieRJEt mt-4" onClick={Deposit}>{t("Confirm")}</button>}
                                        {loading_deposit === true && <button color="#664200" size="56" className="ieRJEt disabled_btn mt-4">{t("loading...")}</button>}
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default withRouter(Leave);
