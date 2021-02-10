import React from 'react'
import { Nav } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { tg, medium, github, explorerAddress, voom } from '../config/configs'

const Footer = () => {
    const { t } = useTranslation()

    return (
        <div className="footer_container">
            <div className="footer_center">
                <Nav className="justify-content-center footer" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link href={github} target="_blank">Github</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={`${explorerAddress}${voom}#code`} target="_blank">Voom Contract</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={tg} target="_blank">Telegram</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={medium} target="_blank">Medium</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="https://docs.binance.org/smart-chain/wallet/metamask.html" target="_blank">{t("Connect Metamask with Binance")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </div>
    )
}

export default Footer
