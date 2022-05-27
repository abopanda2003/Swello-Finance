import { useCall, useCalls, useContractFunction, useEthers } from '@usedapp/core';
import { Contract, utils, BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import ItemContract from '../../abi/SwelloAbi.json';
import { SWELLO_CONTRACT_ADDRESS } from '../../common/environmentVariables';

const swelloContractAddress = `${SWELLO_CONTRACT_ADDRESS}`;
const swelloContractInterface = new utils.Interface(ItemContract);
const swelloContract = new Contract(
  swelloContractAddress,
  swelloContractInterface
);

export function useGetSwelloBalance(account) {
  const [balanceOf, setBalanceOf] = useState(0);
  const [pending, setPending] = useState(false);
  // const { account } = useEthers()
  const { value, error } =
    useCall(
      account &&
      {
        contract: swelloContract,
        method: 'balanceOf',
        args: [account],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      const balance = BigNumber.from(value.toString());
      setBalanceOf(Number(utils.formatEther(balance)));
      setPending(false);
    }
    if (error) {
      setPending(false);
      setBalanceOf(undefined);
    }
  }, [value, error]);

  return { balanceOf, error, pending };
}

export function useTotalSupply() {
  const [totalSupply, setTotalSupply] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { value, error } =
    useCall(
      {
        contract: swelloContract,
        method: 'totalSupply',
        args: [],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      setTotalSupply(value?.[0].toString());
      setPending(false);
    }
    if (error) {
      console.error(error.message);
      setPending(false);
      setTotalSupply(undefined);
    }
    // console.log('WHAT AM I GETTING', value, error)
  }, [value, error]);

  return { totalSupply, error, pending };
}

export function useGetCirculatingSupply() {
  const [circulatingSupply, setCirculatingSupply] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { value, error } =
    useCall(
      {
        contract: swelloContract,
        method: 'getCirculatingSupply',
        args: [],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      var supply = (value?.[0]).toString()
      supply = parseInt(Number(supply) / Math.pow(10, 18));
      setCirculatingSupply(supply);
      setPending(false);
    }
    if (error) {
      console.error(error.message);
      setPending(false);
      setCirculatingSupply(undefined);
    }
    // console.log('WHAT AM I GETTING', value, error)
  }, [value, error]);

  return { circulatingSupply, error, pending };
}

export function useGetTreasury() {
  const [treasury, setTreasury] = useState(undefined);
  const [pending, setPending] = useState(false);

  const { value, error } =
    useCall(
      {
        contract: swelloContract,
        method: 'Treasury',
        args: [],
      }
    ) ?? {};
  useEffect(() => {
    setPending(true);
    if (value) {
      setTreasury(value?.[0].toString());
      setPending(false);
    }
    if (error) {
      console.error(error.message);
      setPending(false);
      setTreasury(undefined);
    }
    // console.log('WHAT AM I GETTING', value, error)
  }, [value, error]);

  return { treasury, error, pending };
}


export function useGetTreasuryAndSafetyAddress() {
  const [address, setAddress] = useState(undefined);
  const [pending, setPending] = useState(false);

  var methodsName = ['treasuryReceiver', 'safetyFundReceiver']
  const calls = methodsName?.map(name => ({
    contract: swelloContract,
    method: name,
    args: []
  })) ?? []
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if (result && result.error) {
      setPending(false);
      console.error(`Error encountered calling: =>  result.error`)
    }
  })

  useEffect(() => {
    setPending(true);
    if (results.length > 0 && results?.[0] && results?.[1]) {
      setAddress({ treasuryAddress: results[0]?.value?.[0], safetyFundAddress: results[1]?.value?.[0] })
      setPending(false);
    }
  }, [results]);
  return { treasuryAddress: address?.treasuryAddress, safetyFundAddress: address?.safetyFundAddress };
  // return { treasuryAddress: "0x3048c2C88Cf222412BD80AB12522557965cC6565", safetyFundAddress: "0x3048c2C88Cf222412BD80AB12522557965cC6565" };
}



export function useGetTreasuryAndSafetyFund(treasuryAddress, safetyFundAddress) {

  // if(treasuryAddress === undefined ||  safetyFundAddress === undefined ) {
  //   return;
  // }

  const [treasuryFundValue, setTreasuryFundValue] = useState(undefined);
  const [safetyFundValue, setSafetyFundValue] = useState(undefined);
  const [pending, setPending] = useState(false);

  var addresses = [treasuryAddress, safetyFundAddress]

  const calls = addresses?.map(address => ({
    contract: swelloContract,
    method: 'balanceOf',
    args: [address]
  })) ?? []
  const results = useCalls(calls) ?? []
  results.forEach((result, idx) => {
    if (result && result.error) {
      setPending(false);
      console.error(`Error encountered calling: =>  result.error`)
    }
  })

  useEffect(() => {
    setPending(true);
    if (results.length > 0 && results?.[0] && results?.[1]) {
      var treasuryValTemp = (results[0]?.value?.[0]).toString()
      var safetyValTemp = (results[1]?.value?.[0]).toString()
      var treasuryVal = parseInt(Number(treasuryValTemp) / Math.pow(10, 18));
      var safetyVal = parseInt(Number(safetyValTemp) / Math.pow(10, 18));
      setTreasuryFundValue(Number(treasuryVal).toFixed(10))
      setSafetyFundValue(Number(safetyVal).toFixed(10))
      setPending(false);
    }
  }, [results]);

  return { treasuryFundValue, safetyFundValue };
}

