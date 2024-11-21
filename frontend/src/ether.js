import { ethers } from "ethers";
import config from "./config";

const provider = new ethers.providers.JsonRpcProvider(config.network);
const signer = provider.getSigner();
const contract = new ethers.Contract(config.contractAddress, contractABI, signer);
