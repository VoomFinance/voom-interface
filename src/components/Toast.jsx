import React from 'react'
import Toasts from 'react-bootstrap/Toast'
import { useSelector, useDispatch } from "react-redux";
import { explorerHash } from "../config/configs"

const Toast = () => {
    const dispatch = useDispatch()
    const show = useSelector((store) => store.toast.show);
    const type = useSelector((store) => store.toast.type);
    const data = useSelector((store) => store.toast.data);

    const hide = () => {
        dispatch({ type: 'SHOW_TOAST', payload: false })
    }

    return (
        <div className="toastGlobal">
            <div>
            <Toasts onClose={() => hide()} show={show} className={`toast_${type}`}>
                <Toasts.Header className={`toast_${type}`}>
                    <strong className="mr-auto toast_title">{data.title}</strong>
                </Toasts.Header>
                <Toasts.Body>
                    <div className="toast_value">
                        {data.value}
                    </div>
                    {
                        data.hash && data.hash !== null && 
                        <div className="view_Hash">
                            <a href={`${explorerHash}${data.hash}`} target="_blank" rel="noreferrer" className="view_hash_value">View hash</a>
                        </div> 
                    }
                </Toasts.Body>
            </Toasts>
            </div>
        </div>
    )
}

export default Toast
