import React from 'react'
import { useTranslation } from "react-i18next"
import imgLogo from '../assets/images/compounder.png'
import Leave from '../components/Leave'
import Enter from '../components/Enter'
import { compounder } from '../config/configs'

const Compounder = () => {
    const { t } = useTranslation()

    const openDetail = () => {
        window.open(compounder)
    }

    return (
        <div>
            <div className="bootstrap-wrapper">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-12">
                            <div className="home_container_header">
                                <div className="home_container_header_logo"><img src={imgLogo} height="120" alt="" /></div>
                                <h1 className="home_container_header_h1">{t("BUSD Compounder")}</h1>
                                <h3 className="home_container_header_h3">{t("Reinvest your Vault daily earnings into our compounder to maximize your promised amount!")}</h3>
                            </div>
                        </div>
                        <div className="col-12 container_vaults">
                            <div className="kxdBff">
                                <Leave />
                                <div size="24" className="iCOerc"></div>
                                <Enter />
                            </div>
                        </div>
                        <div className="col-12 mt-5 mb-5 container_vaults">
                            <h3 className="kKRWkn comm_net" onClick={openDetail}>
                                ℹ️ {t("Read more about the compounder")}.
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Compounder
