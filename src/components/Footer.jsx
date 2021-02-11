import React from 'react'
import { Nav } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { tg, medium, github, explorerAddress, voom } from '../config/configs'

const Footer = () => {
    const { t, i18n } = useTranslation()

    const getLang = () => {
        const lang = localStorage.getItem('lang')
        if (lang !== 'undefined' && lang !== null) {
            return lang
        } else {
            return 'en'
        }
    }

    const change = (e) => {
        e.preventDefault()
        let lang = getLang()
        if(lang === 'en'){
            localStorage.setItem('lang', 'es')
            i18n.changeLanguage('es')
        } else if(lang === 'es'){
            localStorage.setItem('lang', 'en')
            i18n.changeLanguage('en')
        }        
    }

    return (
        <div className="footer_container">
            <div className="footer_center">
                <Nav className="justify-content-center footer">
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
                        <Nav.Link href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank">{t("Connect Metamask with Binance")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={(e) => change(e)}>{t("Change language")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </div>
    )
}

export default Footer
