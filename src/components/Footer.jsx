import React from 'react'
import { Nav } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { medium, github, explorerAddress, voom, usdt, metamask } from '../config/configs'
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

const Footer = () => {
    const { t, i18n } = useTranslation()
    const isConnected = useSelector((store) => store.web3.isConnected);
    const { addToast } = useToasts();

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

    const addToken = async(e) => {
        e.preventDefault()
        if (!isConnected) {
            addToast(t("You are not connected to the network"), {
                appearance: "error",
                autoDismiss: true,
            });
            return
        }        
        try {
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                  type: 'ERC20',
                  options: {
                    address: usdt,
                    symbol: 'USDT',
                    decimals: 18,
                    image: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
                  }
                }
              })
              if (wasAdded) {
                addToast(t('USDT added to metamask successfully'), {
                    appearance: 'success',
                    autoDismiss: true,
                })
              } else {
                addToast(t("USDT could not be added to metamask"), {
                    appearance: "error",
                    autoDismiss: true,
                });
              }
        } catch (error) {
            addToast(error.message, {
                appearance: "error",
                autoDismiss: true,
            });
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
                        <Nav.Link onClick={(e) => addToken(e)}>{t("Add USDT to metamask")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={medium} target="_blank">Medium</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href={metamask} target="_blank">{t("Connect Metamask with Binance")}</Nav.Link>
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
