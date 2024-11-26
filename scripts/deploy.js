require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // 获取部署账户
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);
  const balanceBefore = await deployer.getBalance();
  console.log("Deployer account balance before deployment:", ethers.utils.formatEther(balanceBefore), "ETH");

  // 超级管理员地址
  const superAdmin = deployer.address;
  console.log("\nSuper Admin (default admin role):", superAdmin);

  // 部署合约
  console.log("\nDeploying JewelryCertificate contract...");
  const JewelryCertificate = await ethers.getContractFactory("JewelryCertificate");
  const contract = await JewelryCertificate.deploy(superAdmin); // 传入 superAdmin 参数
  await contract.deployed();

  console.log("\nContract deployed to:", contract.address);
  console.log("Deployer account balance after deployment:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // 从 .env 文件加载角色地址
  const roles = {
    MINER_ROLE: { hash: ethers.utils.id("MINER_ROLE"), address: process.env.EXTRA_MINER },
    CUTTER_ROLE: { hash: ethers.utils.id("CUTTER_ROLE"), address: process.env.EXTRA_CUTTER },
    GRADER_ROLE: { hash: ethers.utils.id("GRADER_ROLE"), address: process.env.EXTRA_GRADER },
    JEWELER_ROLE: { hash: ethers.utils.id("JEWELER_ROLE"), address: process.env.EXTRA_JEWELER },
    CUSTOMER_ROLE: { hash: ethers.utils.id("CUSTOMER_ROLE"), address: process.env.EXTRA_CUSTOMER },
  };

  // 分配角色的辅助函数
  const grantRole = async (roleName, roleInfo) => {
    if (!ethers.utils.isAddress(roleInfo.address)) {
      console.warn(`${roleName} address is invalid or not provided, skipping.`);
      return;
    }

    try {
      console.log(`Granting ${roleName} to address: ${roleInfo.address}...`);
      const tx = await contract.grantRole(roleInfo.hash, roleInfo.address, {
        gasLimit: ethers.utils.hexlify(100000), // 设置静态 Gas 限额
      });
      await tx.wait();
      console.log(`${roleName} granted to: ${roleInfo.address}`);
    } catch (error) {
      console.error(`Error granting ${roleName}:`, error);
    }
  };

  // 循环分配角色
  for (const [roleName, roleInfo] of Object.entries(roles)) {
    await grantRole(roleName, roleInfo);
  }

  console.log("\nDeployment and role setup complete!");
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