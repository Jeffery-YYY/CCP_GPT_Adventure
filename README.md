```
npm install --save-dev hardhat 用于编译和部署智能合约
npm install -g truffle         用于智能合约开发和管理
npm install -g ganache-cli     以太坊本地测试网络，用于模拟交易环境
```
> permission denied就加上sudo

# 开发语言
智能合约：Solidity
前端：React.js(暂定，gpt说比较好)

# 定义需求和架构
- 系统架构
    - 智能合约层：编写和部署管理珠宝生命周期的合约
    - 前端ui：React 开发用户界面
    - 后段api(暂时不用)：需要存储和复杂数据处理时考虑

- 功能分解
    - 生命周期事件记录： 定义产品从矿场到消费者手中的主要节点事件
    - 数字证书创建和转移：使用ERC-721(NFT)标准，将每个珠宝的数字证书绑定到唯一标识符。
    - 消费者验证界面：提供直观界面，用户可以通过输入ID或扫描二维码验证真实性


# 前端开发
```
npx create-react-app jewelry-dapp(这个装好了不需要动了)
cd jewelry-dapp
npm install ethers
```

# .env文件配置
MetaMask中导出自己的私钥，填在PRIVATE_KEY里
登录Infura，复制API Key

# 领测试币的地方
MetaMask网络修改为Sepolia
https://cloud.google.com/application/web3/faucet/ethereum/sepolia


# 怎么启动这个项目
```
cd jewelry-dapp
npx hardhat node
```
这一步生成的是本地测试的账号，复制其中一个私钥可以导入metamask
metamask网络配置：
网络名称： 随便
默认RPC URL： 127.0.0.1：8545
链ID： 31337
货币符号： ETH

如果使用localhost连接，复制这个合约地址到fronted/src/config 中的contractAddress
```
npx hardhat run scripts/deploy.js --network localhost
```

启动前端
```
cd frontend
npm start
```
