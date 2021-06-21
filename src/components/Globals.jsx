import React from "react";
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { withRouter } from "react-router-dom"
import { nfu } from '../utils/web3'


const Globals = (props) => {
    const { t } = useTranslation()
    const voom = useSelector((store) => store.web3.voom)
    const [balance, setBalance] = useState(0)
    const [render, setRender] = useState(false)
    const [tvl, setTVL] = useState("")
    const [block, set_block] = useState(0)
    const block_last = useSelector((store) => store.web3.block)
    
    useEffect(() => {
        if(block === 0 && block_last !== null){
            set_block(block_last)
        } else {
            if((block_last-block) >= 3){
                setRender(false)
                set_block(block_last)
            }
        }
    }, [block_last, block])

    useEffect(() => {
        const Init = async (data) => {
            await data.then((r) => {
                setBalance(window.web3Read.utils.fromWei(r + '', 'ether'))
            })
        }
        if(voom !== null && render === false){
            setRender(true)
            if(props.type === "claims"){
                Init(voom.methods.amountGainGlobal().call())
            }
            if(props.type === "bonus"){
                Init(voom.methods.amountBonusGlobal().call())
            }
            if(props.type === "network"){
                Init(voom.methods.amountGainNetworkGlobal().call())
            }
            if(props.type === "lastMember"){
                voom.methods.lastMember().call().then((r) => {
                    setBalance(r)
                })
            }
            if(props.type === "tvl"){
                setTVL("global_child_tvl___")
                Init(voom.methods.TVL().call())
            }
            if(props.type === "compounder"){
                setTVL("global_child_tvl___")
                voom.methods.tvlXBUSD().call().then((r) => {
                    const total = parseFloat(window.web3Read.utils.fromWei(r + '', 'ether')) / 1e18
                    setBalance(total)
                })
            }
        }
    }, [voom, props, render])

    return (
        <div className={`global_child ${tvl}`}>
            <div className="global_child_container_main">
                <div className="global_child_container_data">
                    <div className="global_child_container_values">
                        <span role="img" className="global_child_icon">
                            {props.type === "claims" && t("🚜")}
                            {props.type === "bonus" && t("💰")}
                            {props.type === "network" && t("👫🏻")}
                            {props.type === "lastMember" && t("🧮")}
                            {props.type === "tvl" && t("💵")}
                            {props.type === "compounder" && t("💲")}
                        </span>
                        <div size="24" className="global_child_separator"></div>
                        <div className="global_child_main_flex">
                            <div className="global_child_container_title">
                                {props.type === "claims" && t("Earnings paid")}
                                {props.type === "bonus" && t("Bonuses paid")}
                                {props.type === "network" && t("Network paid commissions")}
                                {props.type === "lastMember" && t("Total users")}
                                {props.type === "tvl" && t("Total Staked Value")}
                                {props.type === "compounder" && t("Total Value in compounder")}
                                
                            </div>
                            <div className="global_child_container_value">
                                {props.type === "lastMember" ? balance : `$${nfu(balance)}`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div className="global_child_footer_container">
                    {props.type === "claims" && t("Global earnings paid to users")}
                    {props.type === "bonus" && t("Fast start bonuses paid to sponsors")}
                    {props.type === "network" && t("Commissions paid to the 7-level unilevel")}
                    {props.type === "lastMember" && t("Active users on the platform")}
                    {props.type === "tvl" && t("Total money in the vault")}
                    {props.type === "compounder" && t("Total money in the compounder")}
                </div>
        </div>
    );
};

export default withRouter(Globals);
