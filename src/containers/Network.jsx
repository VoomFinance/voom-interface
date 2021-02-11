import React from 'react'
import { useTranslation } from "react-i18next"
import imgLogo from '../assets/images/logo_header.png'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Tree from '../components/Tree';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToasts } from "react-toast-notifications";
import { cd } from '../config/configs'

const Network = () => {
    const { t } = useTranslation()
    const isConnected = useSelector((store) => store.web3.isConnected);
    const address = useSelector((store) => store.web3.address);
    const voom = useSelector((store) => store.web3.voom);
    const innerWidth = useSelector((store) => store.theme.innerWidth);
    const [data, setData] = useState({})
    const { addToast } = useToasts();
    const url = window.location.origin + "/#/?r=";

    useEffect(() => {
        const init = async () => {
            if (isConnected && address !== null && voom !== null) {
                let treeData = {
                    id: address,
                    address: address,
                    children: [],
                    data: {
                        amountUser: 0,
                        amountDeposited: 0,
                        amountPromise: 0,
                        amountGain: 0,
                        amountGainNetwork: 0,
                        amountBonus: 0,
                        lastTime: 0
                    },
                    title: address,
                    innerWidth: innerWidth
                }
                await voom.methods.vooms(address).call().then(async (result) => {
                    treeData.amountUser = result.amountUser
                    treeData.amountDeposited = result.amountDeposited
                    treeData.amountPromise = result.amountPromise
                    treeData.amountGain = result.amountGain
                    treeData.amountGainNetwork = result.amountGainNetwork
                    treeData.amountBonus = result.amountBonus
                    treeData.lastTime = result.lastTime
                })
                await voom.methods.members(address).call().then(async (result) => {
                    if (result.referredUsers > 0) {
                        for (let i = 0; i < result.referredUsers; i++) {
                            await voom.methods.memberChild(result.id, i).call().then(async (r) => {
                                await voom.methods.vooms(r).call().then(async (r) => {
                                    if (r.isExist === true) {
                                        treeData.children.push({
                                            id: r.voom,
                                            address: r.voom,
                                            children: [],
                                            data: {
                                                amountUser: r.amountUser,
                                                amountDeposited: r.amountDeposited,
                                                amountPromise: r.amountPromise,
                                                amountGain: r.amountGain,
                                                amountGainNetwork: r.amountGainNetwork,
                                                amountBonus: r.amountBonus,
                                                lastTime: r.lastTime,
                                            },
                                            title: r.voom,
                                            innerWidth: innerWidth
                                        })
                                    }
                                })
                            })
                        }
                    }
                })
                setData(treeData)
            }
        }
        init()
    }, [isConnected, address, voom, innerWidth])

    const copyLink = () => {
        if (isConnected && address !== null) {
            voom.methods
                .isMember(address)
                .call()
                .then((result) => {
                    if (result === true) {
                        addToast(t("The referral link was copied correctly"), {
                            appearance: "success",
                            autoDismiss: true,
                        });
                    } else {
                        addToast(
                            t(
                                "To win from your friends, you need to have played at least once."
                            ),
                            {
                                appearance: "error",
                                autoDismiss: true,
                            }
                        );
                    }
                })
                .catch(() => {
                    addToast(t("An error occurred try again"), {
                        appearance: "error",
                        autoDismiss: true,
                    });
                });
        } else {
            addToast(t("You have not connected your wallet"), {
                appearance: "error",
                autoDismiss: true,
            });
        }
    };

    const CommissionDetail = () => {
        window.open(cd)
    }


    return (
        <div>
            <div className="bootstrap-wrapper">
                <div className="container-fluid ">
                    <div className="row">
                        <div className="col-12">
                            <div className="home_container_header">
                                <div className="home_container_header_logo"><img src={imgLogo} height="120" alt="" /></div>
                                <h1 className="home_container_header_h1">{t("Network structure")}</h1>
                                <h3 className="home_container_header_h3">{t("Build your network and enjoy a small percentage of what your network mines in yields farming")}</h3>
                            </div>
                        </div>
                        <div className="col-12 container_vaults">
                            <div className="tree container_vaults">
                                <Tree json={data} />
                            </div>
                        </div>
                        <div className="col-12 mt-5 mb-5 container_vaults">
                            <h3 className="kKRWkn">
                                💣 {t("If you want to earn commissions from your referrals")}
                                <CopyToClipboard
                                    text={`${url}${address}`}
                                    onCopy={() => copyLink()}
                                >
                                    <a href="#/network" onClick={(e) => e.preventDefault()} > copy link</a>
                                </CopyToClipboard>
                            </h3>
                            <h3 className="kKRWkn comm_net" onClick={CommissionDetail}>
                                ℹ️ {t("Read more about the commissions of the unilevel network")}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Network
