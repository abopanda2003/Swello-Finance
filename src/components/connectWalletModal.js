import React, { useEffect, useState } from 'react'

import { ChainId, useEthers } from '@usedapp/core'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { BSC_NODE } from '../common/environmentVariables'

// ICONS
import metaMask from '../assets/images/MetaMaskFox.svg'
import coinBase from '../assets/images/coinbase.svg'
import walletConnects from '../assets/images/walletconnect.png'
import trustWallet from '../assets/images/trustwallet.png'
import closeIcon from '../assets/images/closeicon.svg'

import { toast } from 'react-toastify'

const ConnectWalletModal = (props) => {
  const { activateBrowserWallet, account, activate, deactivate } = useEthers()
  async function connectMetaMaskWalletOnClick() {
    try {
      await activateBrowserWallet()
      props.onHide()
    } catch (e) {
      // alert(JSON.stringify(e));
      toast.error('Please install MetaMask', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      console.log(e)
    }
  }

  const connectToCoinBase = async () => {
    // const walletlink = new WalletLinkConnector({
    //   url: url,
    //   appName: "passphrase",
    //   supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001],
    // });
    // try {
    //   await activate(walletlink);
    // } catch (ex) {
    //   // console.log(ex);
    // }
  };

  const connectToWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        qrcode: true,
        bridge: 'https://bridge.walletconnect.org',
        rpc: {
          [ChainId.BSCTestnet]:
            process.env.REACT_APP_BSC_TESTNET_RPC,
          // PUBLIC / PRIVATE RPC NODE URL
          // [ChainId.BSC]: `${BSC_NODE}`,
        },

      })
      await provider.enable()
      activate(provider)
      props.onHide()
    } catch (error) {
      console.error(error)
      toast.error(error.message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <>
      <div className="flex justify-center items-center backdrop-blur-3xl overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" onClick={() => {
        // close modal when outside of modal is clicked
        props.onHide();
      }}>
        <div className="relative w-120 h-100 my-6 mx-auto">
          <div className="bg-[#191928] border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none" onClick={e => {
            // do not close modal if anything inside modal content is clicked
            e.stopPropagation();
          }}>
            {/* <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t relative">
              <h3 className="text-2xl font=semibold text-white">
                Connect Your Wallet
              </h3>
              <button
                className="absolute -top-7 right-0 bg-transparent border-0 text-black float-right flex items-center justify-center focus:outline-none"
                onClick={props.onHide}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  x
                </span>
              </button>
            </div> */}
            <div className="relative flex-auto w-[600px] h-[300px]">
              <div className="flex flex-row flex-wrap h-full">
                <div
                  className="rounded-md w-[300px] bg-[#191928] mb-0 px-4 py-2 flex flex-col items-center justify-between cursor-pointer"
                  onClick={() => connectMetaMaskWalletOnClick()}
                >
                  <img src={metaMask} className="w-[50px] h-[50px]" alt="metamask" />
                  <h2 className="font-bold text-[24px] text-base text-white">
                    Metamask
                  </h2>
                  <p className="text-base text-[14px] text-white wallet-description">Connect to your MetaMask Wallet</p>
                </div>
                {/* <div className="rounded-md border-2 border-white-400 px-4 py-2 flex items-center justify-between mb-4 cursor-pointer" onClick={() => connectToCoinBase()}>
                  <h2 className="font-bold text-base text-white">Coinbase</h2>
                  <img src={coinBase} alt="coinbase" />
                </div> */}
                <div
                  className="rounded-md w-[300px] bg-[#191928] mb-0 px-4 py-2 flex flex-col items-center justify-between cursor-pointer"
                  onClick={() => connectToWalletConnect()}
                >
                  <img src={walletConnects} className="w-[50px] h-[50px]" alt="walletConnects" />
                  <h2 className="font-bold text-[24px] text-base text-white">
                    WalletConnect
                  </h2>
                  <p className="text-base text-[14px] text-white wallet-description">Scan with WalletConnect to connect</p>
                </div>
                {/* <div className="rounded-md border-2 border-white-400 px-4 py-2 flex items-center justify-between mb-4 cursor-pointer">
                  <h2 className="font-bold text-base text-white">Trust Wallet</h2>
                  <img src={trustWallet} alt="trustWallet" />
                </div> */}
                <div
                  className="rounded-md w-[300px] bg-[#191928] mb-0 px-4 py-2 flex flex-col items-center justify-between cursor-pointer"
                  onClick={() => connectToCoinBase()}
                >
                  <img src={coinBase} className="w-[50px] h-[50px]" alt="walletConnects" />
                  <h2 className="font-bold text-[24px] text-base text-white">
                    Coinbase
                  </h2>
                  <p className="text-base text-[14px] text-white wallet-description">Connect to your Coinbase Wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConnectWalletModal
