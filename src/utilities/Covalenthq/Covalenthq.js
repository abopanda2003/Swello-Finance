import axios from "axios";
import { COVALENTHQ_API_KEY, COVALENTHQ_API_URL, SWELLO_CONTRACT_ADDRESS } from '../../common/environmentVariables';

export async function patchAction(chain_id, category, action_name, params) {
    let result = await axios.get(`${COVALENTHQ_API_URL}${chain_id}/${category}/${SWELLO_CONTRACT_ADDRESS}/${action_name}/?${params}&key=${COVALENTHQ_API_KEY}`);
    return result.data;
}