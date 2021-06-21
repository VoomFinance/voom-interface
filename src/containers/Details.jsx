import React from 'react'
import { useTranslation } from "react-i18next"
import imgLogo from '../assets/images/logo_header.png'
import Balance from '../components/Balance'
import {Tabs, Tab} from 'react-bootstrap'

const Details = () => {
    const { t } = useTranslation()

    return (
        <div>
            <div className="bootstrap-wrapper">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-12">
                            <div className="home_container_header">
                                <div className="home_container_header_logo"><img src={imgLogo} height="120" alt="" /></div>
                                <h1 className="home_container_header_h1">{t("Detail of my account")}</h1>
                                <h3 className="home_container_header_h3">{t("Our returns on BUSD are the best in the market as our strategies use the best yields farmings.")}</h3>
                            </div>
                        </div>
                        <div className="col-12">
                            <Balance type="global_earnings" />
                            <Balance type="Promise" />
                            <Balance type="amountDeposited" />
                            <Balance type="amountGain" />
                            <Balance type="amountGainNetwork" />
                            <Balance type="amountBonus" />
                            <Balance type="lastTime" />
                            <Balance type="count" /> 
                        </div>
                        <div className="col-12 mt-3">
                        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
  <Tab eventKey="home" title="Home">
    sdfsdfds
  </Tab>
  <Tab eventKey="profile" title="Profile">
  sdfsdfds
  </Tab>
  <Tab eventKey="contact" title="Contact" disabled>
  sdfsdfds
  </Tab>
</Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details
