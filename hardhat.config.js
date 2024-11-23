require("@nomiclabs/hardhat-waffle");
require("dotenv").config();


console.log("Using INFURA_PROJECT_ID:", process.env.INFURA_PROJECT_ID);
console.log("Using PRIVATE_KEY:", process.env.PRIVATE_KEY ? "Loaded" : "Not Loaded");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, // Infura URL for Sepolia
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Private key with 0x prefix
    },
    localhost: {
      url: "http://127.0.0.1:8545", // 本地网络配置
      accounts: [`0x${process.env.PRIVATE_KEY}`], // 确保使用本地节点时有测试账户
    },
  },
};
