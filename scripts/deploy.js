const { ethers } = require("hardhat");

async function main() {
  const JewelryCertificate = await ethers.getContractFactory("JewelryCertificate");
  const contract = await JewelryCertificate.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
