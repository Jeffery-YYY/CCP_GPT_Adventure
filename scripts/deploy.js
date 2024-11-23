require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // 获取部署账户
  const [deployer] = await ethers.getSigners();

  // 输出部署账户的信息
  const balanceBefore = await deployer.getBalance();
  console.log("Deploying contract with the account:", deployer.address);
  console.log("Deployer account balance before deployment:", ethers.utils.formatEther(balanceBefore), "ETH");

  // 获取合约工厂并部署合约
  const JewelryCertificate = await ethers.getContractFactory("JewelryCertificate");
  const contract = await JewelryCertificate.deploy();
  await contract.deployed();

  // 输出合约部署信息
  const balanceAfter = await deployer.getBalance();
  console.log("Contract deployed to:", contract.address);
  console.log("Contract owner (deployer):", deployer.address);
  console.log("Deployer account balance after deployment:", ethers.utils.formatEther(balanceAfter), "ETH");

  // 自动授权部署者账户
  console.log("\nAuthorizing the deployer as a manufacturer...");
  const authorizeTx = await contract.authorizeManufacturer(deployer.address);
  await authorizeTx.wait();
  console.log("Deployer authorized as a manufacturer.");

  // 如果需要，可以添加额外账户授权
  const extraAccountAddress = process.env.EXTRA_ACCOUNT_ADDRESS; // 从 .env 文件中获取额外账户地址
  if (extraAccountAddress) {
    console.log(`Authorizing extra account: ${extraAccountAddress}...`);
    const extraAuthorizeTx = await contract.authorizeManufacturer(extraAccountAddress);
    await extraAuthorizeTx.wait();
    console.log(`Account ${extraAccountAddress} authorized as a manufacturer.`);
  }

  console.log("\nDeployment and setup complete!");
  console.log("Contract Address:", contract.address);
  console.log("Deployer Address:", deployer.address);
}

// 执行部署脚本
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
