import React from 'react'
import Globals from '../components/Globals'
import { useTranslation } from "react-i18next"
import imgLogo from '../assets/images/logo_header.png'

const Home = () => {
    const { t } = useTranslation()

    return (
        <div>
            <div className="bootstrap-wrapper">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-12">
                            <div className="home_container_header">
                                <div className="home_container_header_logo"><img src={imgLogo} height="120" alt="" /></div>
                                <h1 className="home_container_header_h1">Voom Finance</h1>
                                <h3 className="home_container_header_h3">{t("Agricultural Yield Optimizer using the best yield strategies on Binance Smart Chain.")}</h3>
                            </div>
                        </div>
                        <div className="col-12 ">
                            <div className="global_father">
                                <Globals type="tvl" />
                                <div size="24" className="global_child_separator" />
                                <Globals type="compounder" />
                            </div>
                        </div>                        
                        <div className="col-12 mt-4">
                            <div className="global_father">
                                <Globals type="claims" />
                                <div size="24" className="global_child_separator" />
                                <Globals type="bonus" />
                            </div>
                        </div>
                        <div className="col-12 mt-4">
                            <div className="global_father">
                                <Globals type="network" />
                                <div size="24" className="global_child_separator" />
                                <Globals type="lastMember" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
