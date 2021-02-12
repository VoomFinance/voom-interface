import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import { nf, getRevertReason } from '../utils/web3'
import { gas, chef } from '../config/configs'
import BigNumber from 'bignumber.js'
import { useDispatch } from "react-redux"

const Claim = (props) => {
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
    const [block, set_block] = useState(0)
    const block_last = useSelector((store) => store.web3.block)
    const [paused, set_paused] = useState(false)
    const [is_member, set_is_member] = useState(false)
    const [hash, set_hash] = useState(null)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if(block === 0 && block_last !== null){
            set_block(block_last)
        } else {
            if((block_last-block) >= 3){
                set_reload(Math.random())
                set_block(block_last)
            }
        }
    }, [block_last, block])

    useEffect(() => {
        if (isConnected && address !== null && token !== null) {
            voomContract.methods.pending(address).call().then(async (result) => {
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
    }, [isConnected, address, token, reload, voomContract])

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
        try {
            await voomContract.methods.claim().send({
                from: address,
                value: 0,
                gas: 0,
                gasPrice: gas
            }).on("transactionHash", async h => {
                set_hash(h)
                addToast(t('Transaction waiting for confirmation.'), {
                    appearance: 'info',
                    autoDismiss: true,
                })
            }).on('receipt', async (receipt) => {
                set_loading_claim(false)
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
                if(hash !== null){
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
        try {
            await voomContract.methods.reinvest().send({
                from: address,
                value: 0,
                gas: 0,
                gasPrice: gas
            }).on("transactionHash", async h => {
                set_hash(h)
                addToast(t('Transaction waiting for confirmation.'), {
                    appearance: 'info',
                    autoDismiss: true,
                })
            }).on('receipt', async (receipt) => {
                set_loading_reinvest(false)
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
                if(hash !== null){
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
                                {loading_claim === false && <button color="#664200" size="56" className="ieRJEt" onClick={() => Claim(chef, 0)}>{t("Claim")}</button>}
                                {loading_claim === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                                <div size="12" className="separador_vault"></div>
                                {loading_reinvest === false && <button color="#664200" size="56" className="ieRJEt" onClick={Reinvest}>{t("Reinvest")}</button>}
                                {loading_reinvest === true && <button color="#664200" size="56" className="ieRJEt disabled_btn">{t("loading...")}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withRouter(Claim);
