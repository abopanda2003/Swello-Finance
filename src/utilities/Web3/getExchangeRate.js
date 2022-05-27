import { useCall, useCalls, useEtherBalance, useContractFunction, useEthers } from '@usedapp/core';
import { Contract, utils, BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
// import PancakeswapRouterAbi from '../../abi/PancakeswapRouterAbi.json';
import PancakeswapRouterAbi from '../../abi/PancakeswapRouterAbi.json';
import Web3 from 'web3'

const pancakeswapContractAddress = process.env.REACT_APP_CAKE_ADDRESS
// const pancakeswapContractAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const pancakeswapContractInterface = new utils.Interface(PancakeswapRouterAbi);
const pancakeswapContract = new Contract(
  pancakeswapContractAddress,
  pancakeswapContractInterface
);
// console.log('pancakeswapContract',pancakeswapContract)
// const contract = {
//     factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // PancakeSwap V2 factory
//     router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap V2 router
// };

// const tokens = {
//     TITANO: '0xBA96731324dE188ebC1eD87ca74544dDEbC07D7f',
//     SCZ: '0x39f1014a88c8ec087cedf1bfc7064d24f507b894',
//     DOP: '0x844fa82f1e54824655470970f7004dd90546bb28',
// };

// const PancakeSwapRouterContract = new Contract(
//     contract.router,
//     ['function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)'],
// );

export function useGetSwelloPriceInUSD() {
  // console.log(pancakeswapContract)
  // console.log(pancakeswapContract.provider)
  // console.log(pancakeswapContract.provider.getCode(process.env.REACT_APP_SWELLO_CONTRACT))

  // const web3 = new Web3(Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'))
  const [usdtToSwello, setUsdtToSwello] = useState(undefined);
  const [pending, setPending] = useState(false);

  // var price = web3.utils.toWei('1', 'ether');
  var price = utils.parseUnits('1', 'ether');
  // var price = 1;
  var bnbToSwelloPair = [process.env.REACT_APP_WBNB_ADDRESS, process.env.REACT_APP_SWELLO_CONTRACT];
  var bnbToUSDTPair = [process.env.REACT_APP_WBNB_ADDRESS, process.env.REACT_APP_USDT_ADDRESS];
  var pairs = [bnbToSwelloPair, bnbToUSDTPair]

  const calls = pairs?.map(pair => ({
    contract: pancakeswapContract,
    method: 'getAmountsOut',
    args: [price, pair]
  })) ?? []
  const results = useCalls(calls) ?? [];
  results.forEach((result, idx) => {
    if (result && result.error) {
      console.log(result.error)
      // setPending(false);
      console.error(`Error encountered calling: =>  result.error`)
    }
  })

  // useEffect(() => {
  //   setPending(true);
  //   if (results.length > 0 && results?.[0] && results?.[1]) {
  //     console.log('results', results)
  //     console.log('a', (results[0]?.value?.amounts?.[1]).toString())
  //     console.log('b', (results[1]?.value?.amounts?.[1]).toString())
  //     var val1 = (results[0]?.value?.amounts?.[1]).toString()
  //     var val2 = (results[1]?.value?.amounts?.[1]).toString()
  //     var oneBnbToSwello = parseInt(Number(val1) / Math.pow(10, 18));
  //     var oneBnbToUsdt = parseInt(Number(val2) / Math.pow(10, 18));
  //     var oneSwelloPriceInUsd = Number(oneBnbToUsdt / oneBnbToSwello).toFixed(10)
  //     setUsdtToSwello(oneSwelloPriceInUsd)
  //     setPending(false);
  //   }
  // }, [results]);

  return { usdtToSwello };
}

