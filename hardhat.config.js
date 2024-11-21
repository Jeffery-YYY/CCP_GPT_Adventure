require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, // Infura URL for Sepolia
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Private key with 0x prefix
    },
  },
};
