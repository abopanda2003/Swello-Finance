import React, { useState, useEffect } from 'react'
import { useEthers, useEtherBalance } from '@usedapp/core';
import ConnectWalletModal from '../components/connectWalletModal'

export default function Header() {

  const { deactivate, account } = useEthers()
  const balance = useEtherBalance(account)
  const [showModal, setShowModal] = useState(false)

  const disconnectWallet = () => {
    deactivate();
    localStorage.removeItem('walletconnect')
    localStorage.removeItem('shouldConnectMetamask')
  }

  function displayAccount() {
    if (account && balance !== undefined) {
      return (
        <div>
          <span className="pointer">{account}</span>

          <span> | {balance} ETH </span>

          {/* <span className="pointer" onClick={() => {
            setBalance(undefined);
            localStorage.removeItem('account');
          }
          }>
            SIGN OUT
          </span> */}
        </div>
      )
    } else {
      // return !account? <div
      //   className="navbar-login cursor-pointer"
      //   onClick={() => setShowConnectWallet(true)}
      // >
      //   Connect Wallet
      // </div>: null
    }
  }

  return (
    <div className="lg:flex lg:justify-end hidden">
      {!account ? (
        <button onClick={() => setShowModal(true)} className="btn-wallet-connect mt-10 mr-10 font-axi font-bold text-white text-base bg-[#FA55FF] rounded-[27px]">Connect Wallet</button>
      ) : (
        <button onClick={() => disconnectWallet()} className="btn-wallet-connect mt-10 mr-10 font-axi font-bold text-white text-base bg-[#FA55FF] rounded-[27px]">Disconnect Wallet</button>
      )}

      {showModal && (
        <ConnectWalletModal
          onHide={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
