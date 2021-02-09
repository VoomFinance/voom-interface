import React from 'react'
import Routes from './config/Routes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Loading from './components/utils/Loading'
import { showLoading, hideLoading } from './redux/LoadingDucks'
import { Web3Init, Web3Auto } from './utils/web3'

function App() {
  const dispatch = useDispatch()
  const isConnected = useSelector(store => store.web3.isConnected)
  dispatch(showLoading())

  useEffect(() => {
    if(isConnected !== null){
      dispatch(hideLoading())
    }
  }, [dispatch, isConnected])

  return (
    <>
    <Web3Init />
    <Web3Auto />
      {isConnected === null ? <Loading /> : <Routes />}
    </>
  )
}

export default App