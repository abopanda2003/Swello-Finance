import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { ChainId, DAppProvider } from '@usedapp/core';

import './index.css'
import App from './App'

import reportWebVitals from './reportWebVitals'
require('dotenv').config()
const config = {
  pollingInterval: 50000,
  autoConnect: true,
  readOnlyChainId: ChainId.BSCTestnet,
  readOnlyUrls: {
    [ChainId.BSCTestnet]: process.env.REACT_APP_BSC_TESTNET_RPC
  }
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <DAppProvider config={config}>
        <App />
      </DAppProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals()