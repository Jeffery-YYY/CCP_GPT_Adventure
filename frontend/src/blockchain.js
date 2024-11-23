import { ethers } from "ethers";
import DiamondTracking from "./artifacts/contracts/DiamondTracking.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 替换为您的合约地址
const abi = DiamondTracking.abi;

export async function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
}
