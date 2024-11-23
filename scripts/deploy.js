const { ethers } = require("hardhat");

async function main() {
  // 使用自定义私钥
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // 替换为你的私钥
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545"); // 本地网络
  const wallet = new ethers.Wallet(privateKey, provider);

  // 打印部署者信息
  const balanceBefore = await wallet.getBalance();
  console.log("Deploying contract with the account:", wallet.address);
  console.log("Deployer account balance before deployment:", ethers.utils.formatEther(balanceBefore), "ETH");

  // 使用私钥账户部署合约
  const ContractFactory = await ethers.getContractFactory("DiamondTracking", wallet);
  const contract = await ContractFactory.deploy();
  await contract.deployed();

  // 打印部署后信息
  const balanceAfter = await wallet.getBalance();
  console.log("Contract deployed to:", contract.address);
  console.log("Contract owner (deployer):", await contract.owner());
  console.log("Deployer account balance after deployment:", ethers.utils.formatEther(balanceAfter), "ETH");

  console.log("\nEnsure your frontend uses this account to interact with the contract:");
  console.log(wallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
