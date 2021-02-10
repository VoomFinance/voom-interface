import React from 'react'
import { useTranslation } from "react-i18next"
import imgLogo from '../assets/images/logo_header.png'
import Claim from '../components/Claim'
import Deposit from '../components/Deposit'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Vault = () => {
    const { t } = useTranslation()
    const voomContract = useSelector((store) => store.web3.voom);
    const [text, set_text] = useState('')

    useEffect(() => {
        const init = async() => {
            let p = 0
            try {
                await voomContract.methods.daily().call().then(async (result) => {
                    p = window.web3Read.utils.fromWei(result + '', 'ether')
                })            
            } catch (error) {
                p = 0
            }
            let _t = t("Our USDT farm yields maximizer is currently yielding 1111 percent per day.")
            _t = _t.replace('1111', p)
            set_text(_t)
        }
        init()
    }, [voomContract, t])

    return (
        <div>
            <div className="bootstrap-wrapper">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-12">
                            <div className="home_container_header">
                                <div className="home_container_header_logo"><img src={imgLogo} height="120" alt="" /></div>
                                <h1 className="home_container_header_h1">{t("USDT Vault")}</h1>
                                <h3 className="home_container_header_h3">{t("Invest USDT and get a daily percentage of yield crop profit.")}</h3>
                            </div>
                        </div>
                        <div className="col-12 container_vaults">
                            <div className="kxdBff">
                                <Claim />
                                <div size="24" className="iCOerc"></div>
                                <Deposit />
                            </div>
                        </div>
                        <div className="col-12 mt-5 mb-5 container_vaults">
                            <h3 className="kKRWkn">💣 {text}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vault
