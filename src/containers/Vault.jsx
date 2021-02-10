import React from 'react'
import { useTranslation } from "react-i18next"
import imgLogo from '../assets/images/logo_header.png'
import Deposit from '../components/Deposit'

const Vault = () => {
    const { t } = useTranslation()


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
                        <div className="col-12">
                                
                                <Deposit />
                                <div size="24" className="iCOerc"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vault
