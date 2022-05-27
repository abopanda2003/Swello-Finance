import axios from "axios";
import { MORALIS_API_KEY, SWELLO_CONTRACT_ADDRESS, SWELLO_BNB_PAIR_ADDRESS, SWELLO_BUSD_PAIR_ADDRESS, BSC_MAINNET_WBNB_ADDRESS, BSC_MAINNET_BUSD_ADDRESS } from '../../common/environmentVariables';



export async function getSwelloPrice(token_address, chain_id) {
    // const BUSDPrice = await getPrice(BSC_MAINNET_BUSD_ADDRESS, "38");
    // const swello_busd_reserve = await getReserves(SWELLO_BUSD_PAIR_ADDRESS, chain_id);

    const BNBPrice = await getPrice(BSC_MAINNET_WBNB_ADDRESS, "38");
    const swello_bnb_reserve = await getReserves(SWELLO_BNB_PAIR_ADDRESS, chain_id);
    const swello_price = (swello_bnb_reserve.reserve1 * 1000 / swello_bnb_reserve.reserve0 * BNBPrice);
    return swello_price;
}

export async function getPrice(token_address, chain_id) {
    let result = await axios.get(`https://deep-index.moralis.io/api/v2/erc20/${token_address}/price?chain=0x${chain_id}`, {
        headers: {
            'x-api-key': MORALIS_API_KEY
        }
    });
    return result.data.usdPrice.toFixed(2);
}


export async function getReserves(pair_address, chain_id) {
    let result = await axios.get(`https://deep-index.moralis.io/api/v2/${pair_address}/reserves?chain=0x${chain_id}`, {
        headers: {
            'x-api-key': MORALIS_API_KEY
        }
    });
    return result.data;
}

export async function getTransactions(account, token_address, chain_id) {
    let res = await axios.get(`https://deep-index.moralis.io/api/v2/erc20/${account}/transfers?chain=0x${chain_id}`, {
        headers: {
            'x-api-key': MORALIS_API_KEY
        }
    });
    let result = res.data.result.filter(tx => tx.address.toLowerCase() == SWELLO_CONTRACT_ADDRESS.toLowerCase());
    // let result = res.data.result;
    return result;
}