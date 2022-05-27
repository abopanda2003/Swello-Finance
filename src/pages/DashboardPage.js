import React, { useEffect, useState } from 'react'
// contract methods defined
import { useTotalSupply, useGetCirculatingSupply, useGetTreasury, useGetTreasuryAndSafetyAddress, useGetTreasuryAndSafetyFund } from '../utilities/Web3/contract';
import { useGetSwelloPriceInUSD } from '../utilities/Web3/getExchangeRate';
// Images
import PinkBg from '../assets/images/pink-bg.svg'
import Union from '../assets/images/union.svg'
import Dotted from '../assets/images/dotted.svg'
import HolderIcon from '../assets/images/holders.svg'
import { ChainId, useEthers } from '@usedapp/core'
import { getLastReardTime, getLastSwelloData } from '../utilities/Server/server';
import { patchAction } from '../utilities/Covalenthq/Covalenthq';
import { getSwelloPrice } from '../utilities/Moralis/web3Api';
import { SWELLO_CONTRACT_ADDRESS } from '../common/environmentVariables';

export default function DashboardPage() {
  const [rewardTime, setRewardTime] = useState();
  const [holders, setHolders] = useState(0);
  const [showRewardTime, setShowRewardTime] = useState();
  const [timeInterval, setTimeInterval] = useState();


  const { deactivate, account } = useEthers()
  const { totalSupply } = useTotalSupply();
  const { circulatingSupply } = useGetCirculatingSupply();
  const { treasury } = useGetTreasury();
  // const { usdtToSwello } = useGetSwelloPriceInUSD();
  const [usdtToSwello, setUsdtToSwello] = useState(0);
  const { treasuryAddress, safetyFundAddress } = useGetTreasuryAndSafetyAddress();
  const { treasuryFundValue, safetyFundValue } = useGetTreasuryAndSafetyFund(treasuryAddress, safetyFundAddress);
  const [pastCirculatingSupply, setPastCirculatingSupply] = useState(0);
  const [pastTreasuryFundValue, setPasttreasuryFundValue] = useState(0);
  const [pastSafetyFundValue, setPastsafetyFundValue] = useState(0);


  useEffect(() => {
    const callGetPrice = async () => {
      let price = await getSwelloPrice(SWELLO_CONTRACT_ADDRESS, ChainId.BSCTestnet.toString(16));
      setUsdtToSwello(price);
    }
    callGetPrice();
  }, [])


  useEffect(() => {
    const callGetLastSwelloData = async () => {
      let res = await getLastSwelloData(SWELLO_CONTRACT_ADDRESS, ChainId.BSCTestnet.toString(16));
      setPastCirculatingSupply(parseInt(Number(res.circulatingSupply) / Math.pow(10, 18)));
      setPasttreasuryFundValue(parseInt(Number(res.treasuryReceiverBalance) / Math.pow(10, 18)));
      setPastsafetyFundValue(parseInt(Number(res.safetyFundReceiverBalance) / Math.pow(10, 18)));
    }
    callGetLastSwelloData();
  }, [])


  const callGetLastReardTime = async () => {
    let _time = await getLastReardTime();
    setShowRewardTime(_time);
  }

  const callPatchAction = async () => {
    let _holders = await patchAction(ChainId.BSCTestnet.toString(), "tokens", "token_holders", "quote-currency=USD&format=JSON");
    if (_holders.data.items) {
      setHolders(_holders.data.items.length);
    }
  }

  useEffect(() => {
    callGetLastReardTime();
    callPatchAction();
    setInterval(() => {
      setShowRewardTime((t) => t + 1000);
    }, 1000)
  }, []);

  const millisToMinutesAndSeconds = (millis) => {
    if (!millis) {
      return "--:--";
    }
    if (millis >= 900000) {
      callGetLastReardTime();
      return "--:--";
    }
    millis = 900000 - millis;
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }



  return (
    <div className="flex xl:flex-row flex-col xl:space-x-10 xl:mb-0 mb-20">
      <div className="xl:pt-24 pt-4 flex flex-col xl:ml-20 mx-4 text-white xl:mb-[280px] xl:w-[569px] w-auto pt-[84px]">
        <p className="uppercase mb-7 text-2xl font-bold font-blender">Overview</p>
        <div>
          <span className="font-blender font-bold text-xxl">Swello Price</span>
          <br />
          <span className="font-blender font-bold text-4xl">${parseFloat(usdtToSwello).toFixed(4)}</span>
          <span className="font-blender font-bold text-xxl text-[#FA55FF]">↑2.5% </span>
          <span className="font-blender font-bold text-xxl text-[#8D8F95]"> past 24hrs</span>
        </div>

        <div className="relative swello-market-cap flex mt-15 h-29 mb-3">
          <img src={Union} alt="" className="absolute bottom-0 right-0" />
          <div className="flex items-center justify-between absolute w-full h-full px-4 py-4">
            <p className="">
              <span className="font-axi font-normal text-sm">Swello Market Cap</span>
              <br />

              <span className="font-bold font-blender text-3xl">{"$" + (usdtToSwello * circulatingSupply).toFixed(2)}</span>
            </p>
            <p className="font-blender font-bold text-xl text-white">+{((circulatingSupply / pastCirculatingSupply - 1) * 100).toFixed(2)}%</p>
          </div>
        </div>

        <div className="relative flex mb-3 bg-[#161724] h-29 rounded-[10px]">
          <img src={Union} alt="" className="absolute bottom-0 right-0" />
          <div className="flex items-center justify-between absolute w-full h-full px-4 py-4">
            <p className="">
              <span className="font-axi font-normal text-sm">Swello Treasury Assets</span>
              <br />
              <span className="font-bold font-blender text-3xl">${(usdtToSwello * treasuryFundValue).toFixed(2)}</span>
            </p>
            <p className="font-blender font-bold text-xl text-[#FA55FF]">↑{
              treasuryFundValue * pastTreasuryFundValue == 0 ? '0.00' :
                ((treasuryFundValue / pastTreasuryFundValue - 1) * 100).toFixed(2)
            }%</p>
          </div>
        </div>

        <div className="relative flex mb-3 bg-[#161724] h-29 rounded-[10px]">
          <img src={Union} alt="" className="absolute bottom-0 right-0" />
          <div className="flex items-center justify-between absolute w-full h-full px-4 py-4">
            <p className="">
              <span className="font-axi font-normal text-sm">Swello Safety Fund</span>
              <br />
              <span className="font-bold font-blender text-3xl">${(usdtToSwello * safetyFundValue).toFixed(2)}</span>
            </p>
            <p className="font-blender font-bold text-xl text-[#FA55FF]">↑{
              safetyFundValue * pastSafetyFundValue == 0 ? '0.00' :
                ((safetyFundValue / pastSafetyFundValue - 1) * 100).toFixed(2)
            }%</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-7 bg-[#161724] rounded-[6px] h-52 xl:mt-70 xl:w-1/3 mx-4 mb-20">
        <div className="flex items-center justify-between">
          <p className="uppercase font-blender font-bold text-3xl text-white">Next Reward</p>
          <img src={Dotted} alt="" />
        </div>
        <p className="font-axi font-normal text-white text-xl mt-2">{millisToMinutesAndSeconds(showRewardTime)} min</p>
        <div className="mt-6 flex-1 bg-black rounded-[100px]">
          <div className="swello-progress-bar rounded-[100px]" style={{ width: `${showRewardTime / (60000 * 15) * 100}%` }}></div>
        </div>
        <p className="flex items-center justify-center text-center mt-6 mb-6">
          <img src={HolderIcon} alt="" className="mr-2" />
          <span className="font-axi font-normal text-xl text-white">{holders} Holders</span>
        </p>
      </div>
    </div>
  )
}
