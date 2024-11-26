import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";

// 从环境变量加载合约地址
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export const getContract = async () => {
  if (!contractAddress) {
    throw new Error("Contract address is not defined in .env");
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    console.error("Failed to initialize contract:", error);
    throw error;
  }
};