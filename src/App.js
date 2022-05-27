import './App.css'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import WalletConnectProvider from '@walletconnect/web3-provider'
import { useEthers, ChainId } from '@usedapp/core'

import { ToastContainer, toast } from 'react-toastify'
// import { css } from 'glamor';
import 'react-toastify/dist/ReactToastify.css'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import WalletPage from './pages/WalletPage'
import DashboardPage from './pages/DashboardPage'
import CalculatorPage from './pages/CalculatorPage'
import MobileMenu from './components/MobileMenu'

function App() {

  const { activateBrowserWallet, activate, chainId } = useEthers()

  useEffect(() => {
    if (ChainId.BSCTestnet !== chainId) {
      toast.error("Connect to Binance Smart Chain and refresh page", {
        position: 'bottom-left',
        // autoClose: false,
        draggable: true,
      })
    }
    const checkWalletConnectSession = async () => {
      if (window.localStorage.walletconnect) {
        const provider = new WalletConnectProvider({
          qrcode: true,
          bridge: 'https://bridge.walletconnect.org',
          rpc: {
            [ChainId.BSCTestnet]:
              process.env.REACT_APP_BSC_TESTNET_RPC,
          },

        })
        await provider.enable()
        activate(provider)
        activateBrowserWallet()
      }
    }

    checkWalletConnectSession()
  }, [chainId])

  return (
    <>
      <ToastContainer progressClassName="toastProgress" position="" bodyClassName="toastBody" iconClassName toastStyle={{ backgroundColor: "#161724" }} />
      <div className="flex lg:flex-row flex-col relative main-content">
        <Sidebar />
        <div className="flex-1 bg-main-content">
          <div className="bg-main-content w-full h-full ">
            <Header />
            <Routes>
              <Route exact path="/" element={<WalletPage />} />
              <Route exact path="/dashboard" element={<DashboardPage />} />
              <Route exact path="/calculator" element={<CalculatorPage />} />
            </Routes>
          </div>
          <MobileMenu />
        </div>
      </div>
    </>
  )
}

export default App
