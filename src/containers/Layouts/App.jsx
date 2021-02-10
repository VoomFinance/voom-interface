import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Layout = (props) => {
    let params = queryString.parse(props.location.search)
    const dispatch = useDispatch()
    const voom = useSelector(store => store.web3.voom)

    useEffect(() => {
        if (params.ref && params.ref !== null && params.ref !== undefined) {
            try {
                voom.methods.members(params.ref).call().then((result) => {
                    if (result.isExist === true) {
                        dispatch({ type: 'CHANGE_SPONSOR', payload: params.ref })
                        localStorage.setItem("sponsor", params.ref )
                    } else {
                        try {
                            voom.methods.membersList(0).call().then((result) => {
                                dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                                localStorage.setItem("sponsor", result )
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
                        localStorage.setItem("sponsor", result )
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
                            localStorage.setItem("sponsor", _sponsor )
                        } else {
                            try {
                                voom.methods.membersList(0).call().then((result) => {
                                    dispatch({ type: 'CHANGE_SPONSOR', payload: result })
                                    localStorage.setItem("sponsor", result )
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
                            localStorage.setItem("sponsor", result )
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
                        localStorage.setItem("sponsor", result )
                    })                    
                } catch (error) {
                    dispatch({ type: 'CHANGE_SPONSOR', payload: null })
                    localStorage.removeItem("sponsor")
                }
            }
        }
    }, [dispatch, params, voom])


    return (
        <>
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
