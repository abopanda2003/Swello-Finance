import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { useEthers, useTokenBalance, ChainId } from '@usedapp/core'
import { utils, providers } from 'ethers'
import { format } from 'date-fns'



import SwelloCard from '../components/SwelloCard'
import DashboardChart from '../components/DashboardChart'
import { useGetSwelloBalance, } from '../utilities/Web3/contract'
import { useGetSwelloPriceInUSD } from '../utilities/Web3/getExchangeRate';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import Rewards from '../assets/images/rewards.svg'
import Owned from '../assets/images/owned.svg'
import Total from '../assets/images/total.svg'
import Trade from '../assets/images/trade.svg'
import Earnings from '../assets/images/earnings.svg'
import LogoIcon from '../assets/images/logo-icon.svg'
import { getSwelloPrice, getTransactions } from '../utilities/Moralis/web3Api';
import { SWELLO_CONTRACT_ADDRESS } from '../common/environmentVariables';
import { getLastReardTime } from '../utilities/Server/server';
import ConnectWalletModal from '../components/connectWalletModal';

const swelloContractAddress = `${SWELLO_CONTRACT_ADDRESS}`;
const everyReward = Math.pow(146848, 1 / (365 * 24 * 4));
const howManyDaysBefore = (date) => {
  return (new Date(new Date().toDateString()) - new Date(new Date(date).toDateString())) / (3600 * 24 * 1000)
}

const getBalanceOfDateBegin = (endBalance, startTime, endTime, data) => {
  let startBalance = endBalance;
  data = data ? data : [];
  data.forEach((tx, index) => {
    let rewardTimes = (Math.floor((startTime - tx.timestamp) / (15 * 60 * 1000)))
    startBalance = startBalance / Math.pow(everyReward, rewardTimes) + tx.value;
    startTime = tx.timestamp;

    endBalance += tx.value;  // Calcualte for Reward of this day.
  });
  startBalance = startBalance / Math.pow(everyReward, (Math.floor((startTime - endTime) / (15 * 60 * 1000))));

  return { startBalance: startBalance, reward: endBalance - startBalance };
}

export default function WalletPage() {
  const [showModal, setShowModal] = useState(false)

  const historyEndRef = useRef(null)
  const [timeInterval, setTimeInterval] = useState();
  const { deactivate, account } = useEthers()
  const [price, setPrice] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [earned, setEarned] = useState(0);
  const { balanceOf: swelloBalance } = useGetSwelloBalance(account);

  // const { usdtToSwello } = useGetSwelloPriceInUSD();
  // console.log('usdtToSwello', usdtToSwello)


  const [rewardTime, setRewardTime] = useState(0);
  const [showRewardTime, setShowRewardTime] = useState();

  const millisToMinutesAndSeconds = (millis) => {
    if (!millis) {
      return "--:--";
    }
    if (millis >= 900000) {
      console.log("call2")
      callGetLastReardTime("call2");
      return "--:--";
    }
    millis = 900000 - millis;
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  const calculateDailyRebase = (transactions) => {
    let dailyTransactions = {};
    let dailyBalances = {};
    transactions.some((tx) => {
      if (howManyDaysBefore(tx.block_timestamp) > 500) {    // get transactions for only 3 days from now.
        return true;  // break this loop
      }
      if (!dailyTransactions[new Date(tx.block_timestamp).toLocaleDateString()]) {
        dailyTransactions[new Date(tx.block_timestamp).toLocaleDateString()] = [];
      }
      dailyTransactions[new Date(tx.block_timestamp).toLocaleDateString()].push({
        timestamp: new Date(tx.block_timestamp),
        value: tx.from_address.toLowerCase() == account.toLowerCase() ? (Number(tx.value) / Math.pow(10, 18)) : (Number(tx.value) / Math.pow(10, 18) * (-1))
      });
    });

    for (let i = 0; i < 3; i++) {
      let dateKey = new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString();
      let endBalance = i === 0 ? swelloBalance : dailyBalances[new Date(new Date().setDate(new Date().getDate() - (i - 1))).toLocaleDateString()].startBalance;
      let startTime = i === 0 ? new Date() : new Date(new Date(new Date().setDate(new Date().getDate() - (i - 1))).toLocaleDateString());
      dailyBalances[dateKey] = getBalanceOfDateBegin(endBalance, startTime, new Date(dateKey), dailyTransactions[dateKey]);
    };
    setRewardHistory(Object.keys(dailyBalances).map(key => {
      return { date: key, reward: dailyBalances[key].reward, balance: dailyBalances[key].startBalance };
    }));
    let _earned = 0;
    Object.keys(dailyBalances).forEach(key => _earned += dailyBalances[key].reward);
    setEarned(_earned * price);
  }

  const callGetLastReardTime = async (note) => {
    let _time = await getLastReardTime();
    setShowRewardTime(_time);
  }
  useEffect(() => {
    callGetLastReardTime("call1");
  }, []);

  useEffect(() => {
    clearInterval(timeInterval);
    setTimeInterval(setInterval(() => {
      setShowRewardTime((t) => t + 1000);
    }, 1000));
  }, []);


  useEffect(() => {
    const callGetPrice = async () => {
      let price = await getSwelloPrice(swelloContractAddress, ChainId.BSCTestnet.toString(16));
      setPrice(price);
    }
    callGetPrice();
  }, [])

  useEffect(() => {
    const callGetTransactions = async () => {
      let transactions = await getTransactions(account, swelloContractAddress, ChainId.BSCTestnet.toString(16));
      calculateDailyRebase(transactions);
    }
    if (swelloBalance) {
      callGetTransactions();
    }
  }, [swelloBalance, price])

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex lg:flex-row flex-col lg:pt-24 md:pt-10 pt-4">
      <div className="lg:ml-20 lg:mx-0 md:mx-32 mx-4 z-[2]">
        <div className="flex flex-col ">
          <p className="uppercase text-white mb-3 text-2xl font-bold font-blender lg:order-1 order-1">
            Your wallet
          </p>
          <SwelloCard swelloBalance={swelloBalance} price={price} />

          <p className="lg:order-3 order-4 uppercase  font-blender font-bold text-xl text-white mb-2.5 lg:hidden block mt-10">
            Next Reward
          </p>
          <div className="lg:order-3 order-4 px-3.5 py-4 lg:mt-16 mt-0 flex items-center justify-between space-x-4 bg-[#161724] rounded-xl">
            <p>
              <span className="font-blender text-xl font-bold text-[#8A8A98] mb-1">
                {millisToMinutesAndSeconds(showRewardTime)}
              </span>
              <br />
              <span className="font-axi font-normal text-xs text-[#D0D0DA]">
                min
              </span>
            </p>
            <div className="progress-group flex flex-col flex-1 gap-4">
              <div className="flex flex-1 flex-row w-full gap-2 justify-between">
                <div className="flex-1 flex-col bg-black rounded-[3px] w-3/12">
                  <div
                    className="swello-owned-progress-bar rounded-[3px]"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="reward-status w-9/12">
                  <p className="font-blender text-[7px] text-white">
                    {`$${Number(swelloBalance * price * (Math.pow(146848, 1 / (365 * 24 * 4)) - 1)).toFixed(2)}`} next reward
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-black rounded-[3px]">
                <div
                  className="swello-progress-bar rounded-[3px]"
                  style={{ width: `${showRewardTime / (60000 * 15) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="font-blender font-bold text-xl text-white">
              ${`${Number(swelloBalance * price * (Math.pow(146848, 1 / 365) - 1)).toFixed(2)}`} / day
            </p>
          </div>

          <p className="lg:order-3 order-4 uppercase  font-blender font-bold text-xl text-white mb-2.5 lg:hidden block mt-7">
            Lifetime Gains
          </p>
          <div className="lg:order-4 order-5 flex sm:flex-row flex-col justify-between gap-2 lg:space-x-0 space-x-0 sm:space-y-0 space-y-4 lg:mt-10 mt-0">
            <div className="earning-card sm:ml-0 bg-[#161724] rounded-[10px] lg:px-2 md:px-1 px-2 py-2 w-1/2 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 progress-1">
                <CircularProgressbarWithChildren
                  value={(earned / (swelloBalance * price)) * 100}
                  circleRatio={0.75}
                  styles={buildStyles({
                    rotation: 1 / 2 + 1 / 8,
                    strokeLinecap: 'butt',
                    trailColor: '#05050F',
                  })}
                  strokeWidth={9}
                >
                  <img src={Rewards} alt="" className="" />
                </CircularProgressbarWithChildren>
              </div>
              <p className="text-xs font-normal font-axi text-[#D0D0DA] text-center">
                Earned
              </p>
              <p className="font-blender font-bold text-xl text-white text-center">
                {!account ? "$0" : `$${earned.toFixed(2)}`}
              </p>
            </div>
            {/* <div className="earning-card bg-[#161724] rounded-[10px] lg:px-2 md:px-1 ml-1.5 px-2 py-2 w-1/3 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 progress-2">
                <CircularProgressbarWithChildren
                  value={70}
                  circleRatio={0.75}
                  styles={buildStyles({
                    rotation: 1 / 2 + 1 / 8,
                    strokeLinecap: 'butt',
                    trailColor: '#05050F',
                  })}
                  strokeWidth={9}
                >
                  <img src={Owned} alt="" className="" />
                </CircularProgressbarWithChildren>
              </div>
              <p className="text-xs font-normal font-axi text-[#D0D0DA] text-center">
                Owned
              </p>
              <p className="font-blender font-bold text-xl text-white text-center">
                {!account ? "$0" : "$13,031"}
              </p>
            </div> */}
            <div className="earning-card bg-[#161724] rounded-[10px] lg:px-2 md:px-1 px-2 py-2 w-1/2 flex flex-col items-center">
              <div className="w-16 h-16 mb-3 progress-3">
                <CircularProgressbarWithChildren
                  value={100}
                  circleRatio={0.75}
                  styles={buildStyles({
                    rotation: 1 / 2 + 1 / 8,
                    strokeLinecap: 'butt',
                    trailColor: '#05050F',
                  })}
                  strokeWidth={9}
                >
                  <img src={Total} alt="" className="" />
                </CircularProgressbarWithChildren>
              </div>
              <p className="text-xs font-normal font-axi text-[#D0D0DA] text-center">
                Balance
              </p>
              <p className="font-blender font-bold text-xl text-white text-center">
                {!account ? "$0" : `$${(swelloBalance * price).toFixed(2)}`}
              </p>
            </div>
          </div>

          <div className="lg:order-5 order-2 flex items-center justify-center gap-9 lg:mt-10 mt-5">
            <div>
              <div className="swello-trade mb-2.5">
                <img src={Trade} alt="" />
              </div>
              <p className="font-axi font-normal text-base text-white text-center">
                Trade
              </p>
            </div>

            <div onClick={scrollToBottom}>
              <div className="swello-trade mb-2.5 mx-auto w-[64px] h-[64px]">
                <img src={Earnings} alt="" />
              </div>
              <div className="earning-label">
                <p className="font-axi font-normal text-base text-white text-center">
                  {account ? "Earnings" :
                    <span onClick={() => setShowModal(true)}>Connect Wallet</span>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 md:flex-1 lg:flex-1">
        <div className="dashboard-chart lg:px-4 px-0 lg:mt-0 md:mt-10 sm:mt-10 relative">
          <DashboardChart account={account} initbalance={swelloBalance * price} />
        </div>
        <div className="lg:px-4 px-0" ref={historyEndRef}>
          <div
            className="mt-10 bg-[#0F0F13] pt-12 lg:pl-16 pl-4 lg:pr-12 pr-4"
            style={{ borderRadius: '20px 20px 0px 0px' }}
          >
            <hr
              className=" w-28 mx-auto rounded-full h-1 mb-6 lg:hidden block"
              style={{ boder: '4px solid #5B5B65' }}
            />

            <p className="uppercase text-xl font-bold font-blender text-[#F5F5FF]">
              Reward Daily History
            </p>
            <div className="reward-history mt-12 pb-24">
              {
                rewardHistory.map((history, index) => (
                  <>
                    <div className="reward-history-item flex items-center justify-between" key={index.toString() + "history"}>
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#161724] rounded-[14px] p-4">
                          <img src={LogoIcon} alt="" />
                        </div>
                        <p>
                          <span className="font-axi font-normal text-base text-[#F5F5FF]">
                            Swello Reward
                          </span>
                          <br />
                          <span className="font-axi font-normal text-sm text-[#70707C]">
                            {format(new Date(history.date), 'dd.MM.yyyy')}
                          </span>
                        </p>
                      </div>
                      <p className="font-blender font-bold text-xxl text-white">
                        {!account ? "$0" : "$ " + (history.reward * price).toFixed(2)}
                      </p>
                    </div>
                    <hr style={{ border: '1px solid #2C2C35' }} className={`my-5 ${index == rewardHistory.length - 1 ? "lg : hidden block" : ""}`} key={index.toString() + "title"} />
                  </>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ConnectWalletModal
          onHide={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
