# 开发语言
智能合约：Solidity
前端：React.js

# 定义需求和架构
- 系统架构
    - 智能合约层：编写和部署管理珠宝生命周期的合约
    - 前端ui：React 开发用户界面
    - 后段api(暂时不用)：需要存储和复杂数据处理时考虑

- 功能分解
    - 生命周期事件记录： 定义产品从矿场到消费者手中的主要节点事件
    - 数字证书创建和转移：使用ERC-721(NFT)标准，将每个珠宝的数字证书绑定到唯一标识符。
    - 消费者验证界面：提供直观界面，用户可以通过输入ID或扫描二维码验证真实性

# .env文件配置
MetaMask中导出自己的私钥，填在PRIVATE_KEY里
登录Infura，复制API Key

# 领测试币的地方
MetaMask网络修改为Sepolia
https://cloud.google.com/application/web3/faucet/ethereum/sepolia


# 如何启动项目
```
npm install --force
cd frontend
npm install --force

# 依赖包安装后
cd ..   # 回到根目录
npx hardhat node     # 生成本地测试账号
npx hardhat run scripts/deploy.js   # 部署合约,复制地址填入.env
cd frontend
npm start   #  启动前端
```
本地测试账号复制私钥即可导入Meta mask
metamask网络配置：
网络名称： 随便
默认RPC URL： 127.0.0.1：8545
链ID： 31337
货币符号： ETH

# To-do List
- 给用户赋予角色（5种角色类型）

  通过合约主人通过地址授权（在Authorize User这里扩写）

- Log Event 的Token ID根据状态显示在不同角色的下拉框中

- Log Event Description不同角色不同的功能

- 客户购买的珠宝需要验证tokenid 有没有前5个event

- create Certificate作为采矿公司角色的功能


