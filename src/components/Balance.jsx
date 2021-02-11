import React from "react";
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { withRouter } from "react-router-dom"
import { nfu } from '../utils/web3'
import moment from 'moment'

const Balance = (props) => {
    const { t } = useTranslation()
    const voom = useSelector((store) => store.web3.voom)
    const [balance, setBalance] = useState(0)
    const [render, setRender] = useState(false)
    const [block, set_block] = useState(0)
    const block_last = useSelector((store) => store.web3.block)
    const isConnected = useSelector((store) => store.web3.isConnected);
    const address = useSelector((store) => store.web3.address);

    useEffect(() => {
        if (block === 0 && block_last !== null) {
            set_block(block_last)
        } else {
            if ((block_last - block) >= 3) {
                setRender(false)
                set_block(block_last)
            }
        }
    }, [block_last, block])

    useEffect(() => {
        const apr_percent = (min, max, dec) => {
            var precision = Math.pow(10, dec);
            min = min * precision;
            max = max * precision;
            return Math.floor(Math.random() * (max - min + 1) + min) / precision;
        }        
        const Init = async (data, value) => {
            await data.then((r) => {
                if (value === "count") {
                    setBalance(r.referredUsers)
                    return
                }
                if (value === "apy") {
                    let p = parseFloat(window.web3Read.utils.fromWei(r + '', 'ether'))
                    const min = p - (p * 5 / 100)
                    const max = p + (p * 20 / 100)
                    p = apr_percent(min, max, 2)
                    setBalance(p)
                    return
                }
                if (value === "lastTime") {
                    setBalance(moment.unix(r[value]).format('MM-D-YY, h:mm:ss a'))
                    return
                }
                setBalance(window.web3Read.utils.fromWei(r[value] + '', 'ether'))
            })
        }
        if (voom !== null && render === false && isConnected && address !== null) {
            setRender(true)
            if (props.type === "amountDeposited") {
                Init(voom.methods.vooms(address).call(), "amountDeposited")
            }
            if (props.type === "amountGain") {
                Init(voom.methods.vooms(address).call(), "amountGain")
            }
            if (props.type === "amountGainNetwork") {
                Init(voom.methods.vooms(address).call(), "amountGainNetwork")
            }
            if (props.type === "amountBonus") {
                Init(voom.methods.vooms(address).call(), "amountBonus")
            }
            if (props.type === "lastTime") {
                Init(voom.methods.vooms(address).call(), "lastTime")
            }
            if (props.type === "count") {
                Init(voom.methods.members(address).call(), "count")
            }
            if (props.type === "APY") {
                Init(voom.methods.dubbing().call(), "apy")
            }
        }
    }, [voom, props, render, isConnected, address])


    return (
        <>
            <div className={`global_child mt-3 `}>
                <div className="global_child_container_main">
                    <div className="global_child_container_data">
                        <div className="global_child_container_values">
                            <span role="img" className="global_child_icon">
                                {props.type === "APY" && t("🚜")}
                                {props.type === "amountDeposited" && t("💰")}
                                {props.type === "amountGain" && t("🤑")}
                                {props.type === "amountGainNetwork" && t("💵")}
                                {props.type === "amountBonus" && t("💲")}
                                {props.type === "lastTime" && t("⏰")}
                                {props.type === "count" && t("👥")}
                            </span>
                            <div size="24" className="global_child_separator"></div>
                            <div className="global_child_main_flex">
                                <div className="global_child_container_title">
                                    {props.type === "APY" && t("APY")}
                                    {props.type === "amountDeposited" && t("USDT deposited")}
                                    {props.type === "amountGain" && t("My earnings")}
                                    {props.type === "amountGainNetwork" && t("My network earnings")}
                                    {props.type === "amountBonus" && t("My bonuses from my referrals")}
                                    {props.type === "lastTime" && t("Last claim")}
                                    {props.type === "count" && t("Direct users")}
                                </div>
                                <div className="global_child_container_value">
                                    {props.type !== "count" && props.type !== "lastTime" && props.type !== "APY" && <>${nfu(balance)}</>}
                                    {props.type === "count" && <>{parseInt(balance)}</>}
                                    {props.type === "lastTime" && <span className="value_last">{balance}</span>}
                                    {props.type === "APY" && <>{nfu(balance)}%</>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withRouter(Balance)
