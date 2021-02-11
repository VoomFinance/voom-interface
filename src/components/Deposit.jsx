import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { ethers } from 'ethers'
import { nf } from '../utils/web3'
import { voom, gas, chef } from '../config/configs'
import {Modal} from 'react-bootstrap';
import BigNumber from 'bignumber.js'

const Deposit = (props) => {
    const { t } = useTranslation();
    const isConnected = useSelector((store) => store.web3.isConnected);
    const address = useSelector((store) => store.web3.address);
    const token = useSelector((store) => store.web3.token);
    const voomContract = useSelector((store) => store.web3.voom);
    const sponsor = useSelector((store) => store.web3.sponsor);
    const { addToast } = useToasts();
    const [balance, set_balance] = useState(0);
    const [reload, set_reload] = useState(0);
    const [aprovedToken, set_aprovedToken] = useState(false)
    const [loading_aproved, set_loading_aproved] = useState(false)
    const [loading_deposit, set_loading_deposit] = useState(false)
    const [loading_withdral, set_loading_withdral] = useState(false)
    const [show, setShow] = useState(false);
    const [tokens, set_tokens] = useState(0);
    const [maxTokens, set_maxTokens] = useState(0)
    const [maxTokens_ready, set_maxTokens_ready] = useState(0)
    const [isMax, set_isMax] = useState(false)
    const [paused, set_paused] = useState(false)
    const [is_member, set_is_member] = useState(false)
    const reinvest = useSelector((store) => store.web3.reinvest)

    useEffect(() => {
        if (isConnected && address !== null && token !== null) {
            window.token = token
            window.address = address
            window.voom = voom
            token.methods.allowance(address, chef).call().then(async (result) => {
                if (parseFloat(result) > 1000000000) {
                    token.methods.allowance(address, voom).call().then(async (result) => {
                        if (parseFloat(result) > 1000000000) {
                            set_aprovedToken(true)
                            set_loading_aproved(false)
                        }
                    })
                }
            })
            voomContract.methods.vooms(address).call().then(async (result) => {
                set_balance(new BigNumber(result.amountDeposited).div(new BigNumber(10).pow(18)))
            })
            voomContract.methods.paused().call().then(async (result) => {
                set_paused(result)
            })
            voomContract.methods.isMember(address).call().then(async (result) => {
                set_is_member(result)
            })
        }
    }, [isConnected, address, token, reload, voomContract])

    useEffect(() => {
        if (isConnected && address !== null && voomContract !== null) {
            voomContract.methods.vooms(address).call().then(async (result) => {
                set_balance(new BigNumber(result.amountDeposited).div(new BigNumber(10).pow(18)))
            })
        }
    }, [isConnected, address, reinvest, voomContract])

    useEffect(() => {
        if (isConnected && address !== null && token !== null && show === true) {
            set_loading_deposit(false)
            set_tokens("")
            token.methods.balanceOf(address).call().then(async (result) => {
                set_maxTokens_ready(result)
                set_maxTokens(window.web3Read.utils.fromWei(result + '', 'ether'))
            })
        }
    }, [isConnected, address, token, show])

    const Approve = async (addr, type) => {
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        set_loading_aproved(true)
        try {
            await token.methods.approve(addr, ethers.constants.MaxUint256).send({
                from: address,
                value: 0,
                gas: 0,
                gasPrice: gas
            }).on("transactionHash", async h => {
                addToast(t('Transaction waiting for confirmation.'), {
                    appearance: 'info',
                    autoDismiss: true,
                })
            }).on('receipt', async (receipt) => {
                if(type === 0){
                    if (receipt.status) {
                        Approve(voom, 1)
                        return
                    } else {
                        set_loading_aproved(false)
                        addToast(t('An error occurred, try again!'), {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    }
                }
                set_loading_aproved(false)
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
                set_loading_aproved(false)
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
        } catch (error) {
            set_loading_aproved(false)
        }
    }

    const Withdraw = async () => {
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
            addToast(t("Withdrawals are paused at the moment, but you can claim your winnings"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        set_loading_withdral(true)
        try {
            let statusWithdraw = false
            await voomContract.methods.vooms(address).call().then(async (result) => {
                if(parseInt(result.withdraw) === 0){
                    statusWithdraw = true
                } else if(parseInt(result.withdraw) === 1){
                    const timeBetweenLastWithdraw = parseFloat((await window.web3.eth.getBlock()).timestamp) - parseFloat(result.dateWithdraw)
                    if(timeBetweenLastWithdraw >= 86400){
                        statusWithdraw = true
                    } else {
                        set_loading_withdral(false)
                        addToast(t("It takes 24 hours from when the withdrawal is requested for it to execute the extraction of its funds from the yields farming"), {
                            appearance: "error",
                            autoDismiss: true,
                        });
                        return
                    }
                } else {
                    set_loading_withdral(false)
                    addToast(t("You previously withdrew your investment"), {
                        appearance: "error",
                        autoDismiss: true,
                    });
                    return
                }
            })
            if(statusWithdraw){
                try {
                    await voomContract.methods.withdraw().send({
                        from: address,
                        value: 0,
                        gas: 0,
                        gasPrice: gas
                    }).on("transactionHash", async h => {
                        addToast(t('Transaction waiting for confirmation.'), {
                            appearance: 'info',
                            autoDismiss: true,
                        })
                    }).on('receipt', async (receipt) => {
                        set_loading_withdral(false)
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
                        set_loading_withdral(false)
                        addToast(error.message, {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    })
                } catch (error) {
                    set_loading_withdral(false)
                }
            } else {
                set_loading_withdral(false)
            }
        } catch (error) {
            set_loading_withdral(false)
        }
    }

    const Deposit = async () => {
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }
        if (paused) {
            addToast(t("Deposits are paused at the moment, but you can claim your winnings"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }        
        set_loading_deposit(true)
        let totalTokens = new BigNumber(tokens).times(new BigNumber(10).pow(18)) 
        if (isMax) {
            totalTokens = new BigNumber(maxTokens_ready)
        }
        try {
            await voomContract.methods.deposit(totalTokens, sponsor).send({
                from: address,
                value: 0,
                gas: 0,
                gasPrice: gas
            }).on("transactionHash", async h => {
                addToast(t('Transaction waiting for confirmation.'), {
                    appearance: 'info',
                    autoDismiss: true,
                })
            }).on('receipt', async (receipt) => {
                set_loading_deposit(false)
                setShow(false)
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
                addToast(error.message, {
                    appearance: 'error',
                    autoDismiss: true,
                })
            })
        } catch (error) {
            console.log(error)
            set_loading_deposit(false)
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
            for(let i = 0; i < e.length; i++){
                if(e[i] === "."){
                    count++
                }
            }
            if(count <= 1){
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
                                <div className="jlrkvw">🏦</div>
                                <div className="fNiHrC">{nf(balance)}</div>
                                <div className="idGrgN">{t("USDT Balance")}</div>
                            </div>
                            <div className="iftTHE">
                                {aprovedToken === false && loading_aproved === false && <button color="#664200" size="56" className="ieRJEt" onClick={() => Approve(chef, 0)}>{t("Approve Token")}</button>}
                                {aprovedToken === false && loading_aproved === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                                {aprovedToken === true && loading_withdral === false && <button color="#664200" size="56" className="ieRJEt" onClick={Withdraw}>{t("Withdraw")}</button>}
                                {aprovedToken === true && loading_withdral === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                                <div size="12" className="separador_vault"></div>
                                {aprovedToken === true && <button color="#664200" size="56" className="ieRJEt" onClick={() => setShow(true)}>{t("Deposit")}</button>}
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
                                        <p className="connected_title">{t("Deposit USDT")}</p>
                                        <p className="connected_subtitle">{t("Enter the amount of USDT you want to deposit")}</p>
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
                                        {aprovedToken === true && loading_deposit === false && <button color="#664200" size="56" className="ieRJEt mt-4" onClick={Deposit}>{t("Confirm")}</button>}
                                        {aprovedToken === true && loading_deposit === true && <button color="#664200" size="56" className="ieRJEt disabled_btn mt-4">{t("loading...")}</button>}
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

export default withRouter(Deposit);
