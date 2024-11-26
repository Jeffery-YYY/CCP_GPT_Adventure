require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // 从 .env 文件加载配置
  const contractAddress = process.env.CONTRACT_ADDRESS; // 合约地址
  const roleName = process.env.ROLE_NAME; // 角色名称 (e.g., "MINER_ROLE")
  const roleAddress = process.env.ROLE_ADDRESS; // 被授权的地址

  if (!contractAddress || !roleName || !roleAddress) {
    throw new Error("Please set CONTRACT_ADDRESS, ROLE_NAME, and ROLE_ADDRESS in the .env file");
  }

  const [owner] = await ethers.getSigners();
  const JewelryCertificate = await ethers.getContractFactory("JewelryCertificate");
  const contract = await JewelryCertificate.attach(contractAddress);

  // 计算角色哈希
  const roleHash = ethers.utils.id(roleName);

  console.log(`Granting ${roleName} to ${roleAddress}...`);
  const tx = await contract.grantRole(roleHash, roleAddress);
  await tx.wait();

  console.log(`${roleName} granted to ${roleAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error granting role:", error);
    process.exit(1);
  });