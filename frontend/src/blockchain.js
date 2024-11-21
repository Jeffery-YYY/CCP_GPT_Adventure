import { ethers } from "ethers";
import JewelryCertificate from "./artifacts/contracts/JewelryCertificate.json";

const contractAddress = "0x1234567890abcdef1234567890abcdef12345678"; // 替换为您的合约地址
const abi = JewelryCertificate.abi;

export async function getContract() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, abi, signer);
}
