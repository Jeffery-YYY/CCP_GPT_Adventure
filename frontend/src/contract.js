import { ethers } from "ethers";
import JewelryCertificateABI from "./JewelryCertificateABI.json";

export const getContract = async () => {
  // 使用本地或其他网络配置
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  try {
    const network = await provider.getNetwork();
    console.log("Connected to Network:", {
      chainId: network.chainId,
      name: network.name || "unknown",
    });
  } catch (error) {
    console.error("Failed to fetch network details:", error);
    throw error;
  }

  // 确保合约地址从环境变量中获取
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Contract address is not defined in .env file.");
  }

  // 初始化钱包签名器
  const signer = provider.getSigner();
  console.log("Using signer address:", await signer.getAddress());

  // 返回合约实例
  return new ethers.Contract(contractAddress, JewelryCertificateABI, signer);
};
