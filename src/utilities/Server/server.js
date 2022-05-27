import axios from "axios";
import { SERVER_URL } from '../../common/environmentVariables';

export async function getLastReardTime() {
    let result = await axios.get(`${SERVER_URL}getLastReardTime`);
    return result.data.restTime;
}

export async function getLastSwelloData() {
    let result = await axios.get(`${SERVER_URL}swelloData`);
    return result.data;
}