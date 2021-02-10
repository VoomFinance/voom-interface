import React from "react";
import imgMetamask from "../../assets/images/metamask.png";
import imgBsc from "../../assets/images/bsc.png";
import imgTrust from "../../assets/images/trust.png";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from 'react-bootstrap';
import { useState } from "react";
import {
  autoBinanceSmartChain,
  getAddress,
  accountsChanged,
  newBlock,
  autoMetamask,
  Web3ContractsProvider,
} from "../../utils/web3";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";

const Connected = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isConnected = useSelector((store) => store.web3.isConnected);
  const address = useSelector((store) => store.web3.address);
  const { addToast } = useToasts();
  const [show, setShow] = useState(false);

  const checkAddress = async () => {
    let addr = await getAddress();
    if (addr !== null && addr !== undefined) {
      dispatch({ type: "CHANGE_ADDRESS", payload: addr });
      dispatch({ type: "CHANGE_METAMASK", payload: true });
      localStorage.setItem(addr, true);
      newBlock(dispatch);
      accountsChanged(dispatch);
      return true;
    }
    return null;
  };

  const connectBSC = async () => {
    if ((await autoBinanceSmartChain()) === true) {
      try {
        await window.BinanceChain.enable();
        try {
          dispatch({ type: "CHANGE_NETWORK", payload: "eth" });
          if ((await checkAddress()) === true) {
            dispatch({ type: "CHANGE_CONNECTED", payload: true });
            Web3ContractsProvider(dispatch);
          } else {
            dispatch({ type: "CHANGE_CONNECTED", payload: false });
            dispatch({ type: "CHANGE_METAMASK", payload: false });
          }
          setShow(false)
        } catch (error) {
          addToast(t("An error occurred while viewing the wallet"), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } catch (error) {
        addToast(t("An error occurred while enabling the account"), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast(t("Non-BSC browser detected."), {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const connectMetamask = async () => {
    if ((await autoMetamask()) === true) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        try {
          dispatch({ type: "CHANGE_NETWORK", payload: "eth" });
          if ((await checkAddress()) === true) {
            dispatch({ type: "CHANGE_CONNECTED", payload: true });
            Web3ContractsProvider(dispatch);
          } else {
            dispatch({ type: "CHANGE_CONNECTED", payload: false });
            dispatch({ type: "CHANGE_METAMASK", payload: false });
          }
          setShow(false)
        } catch (error) {
          addToast(t("An error occurred while viewing the wallet"), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } catch (error) {
        addToast(t("An error occurred while enabling the account"), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast(t("Non-BSC browser detected."), {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const openModal = async () => {
    setShow(true)
  };

  const disconnected = async () => {
    setShow(false)
    localStorage.setItem(address, false);
    dispatch({ type: "CHANGE_CONNECTED", payload: false });
    dispatch({ type: "CHANGE_METAMASK", payload: false });
    dispatch({ type: "CHANGE_ADDRESS", payload: null });
  };

  return (
    <div className="btnConnected">
      {isConnected === true && (
        <>
          <Button variant="warning" className="btn_connected" onClick={openModal}>{address.substr(0, 6)}...{address.substr(-4)}</Button>
        </>
      )}
      {isConnected !== true && (
        <>
          <Button variant="warning" className="btn_connected" onClick={openModal}>{t("Connect Wallet")}</Button>
        </>
      )}
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
            {isConnected !== true && (
              <div className="container-fluid ">
                <div className="row connected-hover" onClick={connectMetamask}>
                  <div className="col-xl-2 col-md-2 col-sm-2 col-12 connected-center">
                    <img
                      src={imgMetamask}
                      alt=""
                      className="connected-metamask"
                    />
                  </div>
                  <div className="col-xl-10 col-md-10 col-sm-10 col-12 connected-data connected-center">
                    <div className="connected-title">MetaMask</div>
                    <div className="connected-subtitle">
                      {t("Connect to your MetaMask Wallet")}
                    </div>
                  </div>
                </div>
                <hr className="connected-hr" />
                <div className="row connected-hover" onClick={connectBSC}>
                  <div className="col-xl-2 col-md-2 col-sm-2 col-12 connected-center">
                    <img src={imgBsc} alt="" className="connected-bsc" />
                  </div>
                  <div className="col-xl-10 col-md-10 col-sm-10 col-12 connected-data connected-center">
                    <div className="connected-title">Binance Smart Chain</div>
                    <div className="connected-subtitle">
                      {t("Connect to your BSC Wallet")}
                    </div>
                  </div>
                </div>
                <hr className="connected-hr" />
                <div className="row connected-hover" onClick={connectMetamask}>
                  <div className="col-xl-2 col-md-2 col-sm-2 col-12 connected-center">
                    <img
                      src={imgTrust}
                      alt=""
                      className="connected-metamask"
                    />
                  </div>
                  <div className="col-xl-10 col-md-10 col-sm-10 col-12 connected-data connected-center">
                    <div className="connected-title">Trust Wallet</div>
                    <div className="connected-subtitle">
                      {t("Connect to your Trust Wallet")}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isConnected === true && (
              <>
                <div className="container-fluid ">
                  <div className="row">
                    <div className="col-12 connected-center connected-center_disconnect">
                      <p className="connected_title">{t("Disconnect wallet")}</p>
                      <p className="connected_subtitle">{t("Are you sure to disconnect the wallet?")}</p>
                      <Button variant="warning" className="btn_connected" onClick={disconnected}>{t("Confirm")}</Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default withRouter(Connected);
