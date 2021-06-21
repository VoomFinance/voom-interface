import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Toast from '../../components/Toast'

const Layout = (props) => {
    let params = queryString.parse(props.location.search)
    const dispatch = useDispatch()
    const voom = useSelector(store => store.web3.voom)
    const sponsorGlobal = useSelector(store => store.web3.sponsor)
    

    useEffect(() => {
        try {
            const connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org",
                qrcodeModal: QRCodeModal
            })
            if (connector.connected) {
                connector.killSession()
                localStorage.removeItem("WALLECTCONNECT")
            }
        } catch (error) {

        }
    }, [])

    useEffect(() => {
        dispatch({ type: 'CHANGE_INNER_WIDTH', payload: window.innerWidth })
        window.addEventListener("resize", () => {
            dispatch({ type: 'CHANGE_INNER_WIDTH', payload: window.innerWidth })
        })
        if (voom && sponsorGlobal === null ) {
            if (params.ref && params.ref !== null && params.ref !== undefined) {
                try {
                    voom.methods.members(params.ref).call().then((result) => {
                        if (result.isExist === true) {
                            dispatch({ type: 'CHANGE_SPONSOR', payload: params.ref })
                            localStorage.setItem("sponsor", params.ref)
                        } else {
                            try {
                                voom.methods.membersList(0).call().then((result) => {
                                    dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                                    localStorage.setItem("sponsor", result)
                                })
                            } catch (error) {
                                dispatch({ type: 'CHANGE_SPONSOR', payload: null })
                                localStorage.removeItem("sponsor")
                            }
                        }
                    })
                } catch (error) {
                    try {
                        voom.methods.membersList(0).call().then((result) => {
                            dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                            localStorage.setItem("sponsor", result)
                        })
                    } catch (error) {
                        dispatch({ type: 'CHANGE_SPONSOR', payload: null })
                        localStorage.removeItem("sponsor")
                    }
                }
            } else {
                const _sponsor = localStorage.getItem('sponsor')
                if (_sponsor !== 'undefined' && _sponsor !== null) {
                    try {
                        voom.methods.members(_sponsor).call().then((result) => {
                            if (result.isExist === true) {
                                dispatch({ type: 'CHANGE_SPONSOR', payload: _sponsor })
                                localStorage.setItem("sponsor", _sponsor)
                            } else {
                                try {
                                    voom.methods.membersList(0).call().then((result) => {
                                        dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                                        localStorage.setItem("sponsor", result)
                                    })
                                } catch (error) {
                                    dispatch({ type: 'CHANGE_SPONSOR', payload: null })
                                    localStorage.removeItem("sponsor")
                                }
                            }
                        })
                    } catch (error) {
                        try {
                            voom.methods.membersList(0).call().then((result) => {
                                dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                                localStorage.setItem("sponsor", result)
                            })
                        } catch (error) {
                            dispatch({ type: 'CHANGE_SPONSOR', payload: null })
                            localStorage.removeItem("sponsor")
                        }
                    }
                } else {
                    try {
                        voom.methods.membersList(0).call().then((result) => {
                            dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                            localStorage.setItem("sponsor", result)
                        })
                    } catch (error) {
                        dispatch({ type: 'CHANGE_SPONSOR', payload: null })
                        localStorage.removeItem("sponsor")
                    }
                }
            }
        }
    }, [dispatch, params, voom, sponsorGlobal])


    return (
        <>
            <Toast />
            <Header />
            <main>
                <div>
                    {props.children}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default withRouter(Layout)
