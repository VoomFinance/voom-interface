import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import imgBinary from '../assets/images/binary.png'
import imgBinaryOff from '../assets/images/binary_off.png'
import { Modal } from 'react-bootstrap';
import { nf } from '../utils/web3'
import moment from 'moment'
import { explorerAddress } from "../config/configs";

const Tree = (props) => {
    const { t } = useTranslation();
    const voom = useSelector((store) => store.web3.voom);
    const [treeData, set_treeData] = useState({})
    const [val, set_val] = useState(0)
    const innerWidth = useSelector((store) => store.theme.innerWidth);
    const [show, setShow] = useState(false);
    const [data, set_data] = useState(0)
    const [users, set_users] = useState(0)
    const [addr, set_addr] = useState(null)
    const address = useSelector((store) => store.web3.address);

    useEffect(() => {
        set_treeData(props.json)
    }, [props])

    const tdMain = () => {
        return treeData.children ? treeData.children.length * 2 : 1
    }

    const getClassChilden = () => {
        let c = ""
        if (treeData.children.length > 0) {
            c = c + "parentLevel"
        }
        if (treeData.children.length > 0) {
            c = c + " extend"
        }
        return c
    }

    const viewRow = (k, v) => {
        let nameContainer = 'viewRow_' + Math.random()
        return (
            <td key={nameContainer} colSpan="2" className="childLevel">
                <Tree json={v} />
            </td>
        )
    }

    const openDetails = async (e) => {
        set_addr(e.address)
        voom.methods.members(e.address).call().then((r) => {
            set_users(r.referredUsers)
        })
        setShow(true)
        if (e.address !== address) {
            set_data(e.data)
        } else {
            set_data(e)
        }
    }

    const getChildren = async (e) => {
        if (e.children.length <= 0) {
            await voom.methods.members(e.address).call().then(async (result) => {
                if (result.referredUsers > 0) {
                    for (let i = 0; i < result.referredUsers; i++) {
                        await voom.methods.memberChild(result.id, i).call().then(async (r) => {
                            let compounder = 0
                            await voom.methods.BUSDBalance(r).call().then(async (xBUSD) => {
                                compounder = xBUSD
                            })
                            await voom.methods.vooms(r).call().then(async (r) => {
                                if (r.isExist === true) {
                                    e.children.push({
                                        id: r.voom,
                                        address: r.voom,
                                        children: [],
                                        data: {
                                            amountUser: r.amountUser,
                                            amountDeposited: r.amountUser,
                                            amountPromise: r.amountPromise,
                                            amountGain: r.amountGain,
                                            amountGainNetwork: r.amountGainNetwork,
                                            amountBonus: r.amountBonus,
                                            lastTime: r.lastTime,
                                            global_earnings: r.globalEarnings,
                                            status: r.status,
                                            compounder: compounder
                                        },
                                        title: r.voom,
                                        innerWidth: innerWidth,
                                        status: r.status,
                                    })
                                }
                            })
                        })
                    }
                }
            })
            set_treeData(e)
            set_val(Math.random())
        }
    }

    const weiToEther = (r) => {
        try {
            return nf(window.web3Read.utils.fromWei(r + '', 'ether'))
        } catch (error) {
            return 0
        }
    }

    return (
        <>
            <Modal
                centered
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                variant="dark"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Body>
                    <div className="bootstrap-wrapper">
                        <div className="container-fluid ">
                            <div className="row">
                                <div className="col-12 connected-center connected-center_disconnect">
                                    <p className="connected_title">{t("Account detail")}</p>
                                    <a href={`${explorerAddress}${addr}`} target="_blank" rel="noreferrer" className="connected_subtitle mb-3 link-danger linkAnother">{addr}</a>
                                    <p className="connected_subtitle">💰 {t("BUSD deposited")}: ${weiToEther(data.amountDeposited)}</p>
                                    <p className="connected_subtitle">💲 {t("compounder deposited")}: ${weiToEther(data.compounder)}</p>
                                    <p className="connected_subtitle">💸 {t("Global earnings")}: ${weiToEther(data.global_earnings)}</p>
                                    <p className="connected_subtitle">🤑 {t("Earnings")}: ${weiToEther(data.amountGain)}</p>
                                    <p className="connected_subtitle">💵 {t("Network earnings")}: ${weiToEther(data.amountGainNetwork)}</p>
                                    <p className="connected_subtitle">💲 {t("Referral bonuses")}: ${weiToEther(data.amountBonus)}</p>
                                    <p className="connected_subtitle">⏰ {t("Last claim")}: {moment.unix(data.lastTime).format('MM-D-YY, h:mm:ss a')}</p>
                                    <p className="connected_subtitle">👥 {t("Direct users")}: {parseInt(users)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {
                treeData.id &&
                <table>
                    <tbody>
                        <tr>
                            <td colSpan={`${tdMain()}`} className={`${getClassChilden()}`}>
                                <div className="node">
                                    <div className="person">
                                        <div className="avat click" id={treeData.address} variant="outline-success" onClick={() => getChildren(treeData)}>
                                            {treeData.status === false && <img src={imgBinaryOff} alt="" />}
                                            {treeData.status === true && <img src={imgBinary} alt="" />}
                                        </div>
                                        <div className="id click addr_net" onClick={() => openDetails(treeData)}> {treeData.address.substr(0, 6)}...{treeData.address.substr(-4)} </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        {
                            treeData.children.length > 0 &&
                            <>
                                <tr>
                                    {
                                        val >= 0 && treeData.children !== null && treeData.children.length > 0 && treeData.children.map((value, key) => viewRow(key, value))
                                    }
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            }
        </>
    )
}

export default withRouter(Tree)
