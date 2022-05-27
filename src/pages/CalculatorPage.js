import React, { useEffect, useState } from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';

export default function CalculatorPage() {
  const [amount, setAmount] = useState(5000);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(60);
  const [initialInvestment, setInitialInvestment] = useState(0.00);
  const [estimatedRewards, setEstimatedRewards] = useState(60);
  const [potentialReturn, setPotentialReturn] = useState(60);
  const getPrice = async () => {
    let result = await axios.get("https://deep-index.moralis.io/api/v2/erc20/0x4e3cABD3AD77420FF9031d19899594041C420aeE/price?chain=0x38", {
      headers: {
        'x-api-key': '7vl7HSgURTzWpeMbqhvXuX7bLKyqWNvtFOdlTIK9Qqy65JRbprklz3B3KTXWrh7C'
      }
    });
    setPurchasePrice(result.data.usdPrice.toFixed(4));
    setSellPrice(result.data.usdPrice.toFixed(4));
  }
  useEffect(() => {
    getPrice();
  }, [])

  useEffect(() => {
    setInitialInvestment((amount * purchasePrice).toFixed(2));
    setEstimatedRewards((Math.pow(1.0201808352359789181160765506086, numberOfDays) * amount).toFixed(2));
    setPotentialReturn(
      ((Math.pow(1.0201808352359789181160765506086, numberOfDays) * amount) * sellPrice).toFixed(2)
    );
  }, [purchasePrice, sellPrice, amount, numberOfDays])
  return (
    <div className="flex flex-col lg:ml-36 ml-0 lg:mr-60 mr-0 pb-20">
      <p className="uppercase font-bold font-blender text-3xl text-white mb-12 lg:mt-20 mt-11 lg:ml-0 ml-6 hidden lg:block">
        calculator
      </p>
      <p className="uppercase font-bold font-blender text-3xl text-white mb-12 lg:mt-20 mt-11 lg:ml-0 ml-6 lg:hidden block ">
        Potential Return
      </p>
      <div className="swello-calculator lg:mx-0 mx-3 lg:mb-0 mb-32">
        <div className="lg:px-16 px-5 lg:pt-14 pt-10">
          <div className="lg:mb-7 mb-0 flex lg:flex-row flex-col lg:space-x-10 space-x-0">
            <div className="flex flex-col swello-input flex-1 px-4 pt-1 pb-5">
              <label className="relative text-white font-axi font-normal -top-4 left-5 text-sm">Amount of Swello</label>
              <input type="text" defaultValue={5000} value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-[#161724] text-white px-3 text-base font-axi outline-none border-0" placeholder="5000" />
            </div>
            <div className="flex flex-col swello-input flex-1 px-4 pt-1 pb-5 lg:mt-0 mt-7">
              <label className="relative text-white font-axi font-normal -top-4 left-5 text-sm">APY (%)</label>
              <input type="text" value={146848} className="bg-[#161724] text-white px-3 text-base font-axi outline-none border-0" placeholder="146,848" readOnly />
            </div>
          </div>

          <div className="lg:mt-0 mt-7 flex lg:flex-row flex-col lg:space-x-10 space-x-0">
            <div className="flex flex-col swello-input flex-1 px-4 pt-1 pb-5">
              <label className="relative text-white font-axi font-normal -top-4 left-5 text-sm">Swello purchase price</label>
              <div className="swello-purchase-price flex flex-row">
                <input type="text" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="bg-[#161724] text-white px-3 w-full text-base font-axi outline-none border-0" placeholder="0.193348" />
                <div className="text-sm text-white text-weight-medium" style={{ cursor: "pointer" }} onClick={(e) => getPrice()}>Current</div>
              </div>
            </div>
            <div className="flex flex-col swello-input flex-1 px-4 pt-1 pb-5 lg:mt-0 mt-7">
              <label className="relative text-white font-axi font-normal -top-4 left-5 text-sm">Swello sell price</label>
              <div className="swello-sell-price flex flex-row">
                <input type="text" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="bg-[#161724] text-white px-3 w-full text-base font-axi outline-none border-0" placeholder="146,848" />
                <div className="text-sm text-white text-weight-medium" style={{ cursor: "pointer" }} onClick={(e) => getPrice()}>Current</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col lg:mt-16 mt-10 lg:px-16 px-5 swello-slider">
          <p className="lg:w-2/12 w-full font-axi font-normal text-sm text-white">Number of days: {numberOfDays}</p>
          <div className="lg:w-10/12 w-full lg:mt-0 mt-4">
            <Slider
              railStyle={{ background: '#373743' }}
              trackStyle={{ background: '#FA55FF' }}
              min={14}
              max={1000}
              defaultValue={numberOfDays}
              onChange={(value) => { setNumberOfDays(value) }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:mt-16 mt-11 lg:px-16 px-5">
          <div className="flex items-center justify-between text-[#8A8B91] mb-7">
            <p className="font-axi font-normal text-sm">Initial investment</p>
            <p className="font-axi font-normal text-sm">${initialInvestment}</p>
          </div>
          <div className="flex items-center justify-between text-[#8A8B91] mb-9">
            <p className="font-axi font-normal text-sm">Estimated rewards</p>
            <p className="font-axi font-normal text-sm">{estimatedRewards} Swello</p>
          </div>
          <div className="flex items-center justify-between text-white mb-14">
            <p className="font-blender font-bold text-2xl">Potential return</p>
            <p className="font-blender font-bold text-2xl">${potentialReturn} USD</p>
          </div>
        </div>
      </div>
    </div>
  )
}
