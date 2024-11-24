import React, { useState, useEffect } from "react";
import CreateCertificate from "./components/CreateCertificate";
import LogEvent from "./components/LogEvent";
import TransferOwnership from "./components/TransferOwnership";
import { getContract } from "./contract"; // 引入替代的 contract.js 文件

function App() {
  const [account, setAccount] = useState(null); // 当前连接的用户地址
  const [contract, setContract] = useState(null); // 合约实例
  const [status, setStatus] = useState("Initializing..."); // 状态信息显示

  // 初始化钱包连接和合约实例
  useEffect(() => {
    const initApp = async () => {
      if (window.ethereum) {
        try {
          // 请求用户授权连接
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          // 获取合约实例
          const contractInstance = await getContract();
          setContract(contractInstance);

          setStatus("Connected successfully.");
        } catch (error) {
          console.error("Error connecting to wallet or contract:", error);
          setStatus("Failed to connect to wallet or contract. Check console for details.");
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this DApp.");
        setStatus("MetaMask not detected.");
      }
    };

    initApp();
  }, []);

  // 检测账户切换和网络切换
  useEffect(() => {
    if (window.ethereum) {
      // 监听账户变更事件
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          window.location.reload(); // 刷新页面以重新加载合约
        } else {
          setAccount(null);
          setStatus("Disconnected. Please reconnect your wallet.");
        }
      });

      // 监听网络变更事件
      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // 切换网络后重新加载
      });
    }
  }, []);

  return (
    <div className="app">
      <h1>Jewelry Certificate Management</h1>
      {account ? (
        <p>
          Connected Account: <strong>{account}</strong>
        </p>
      ) : (
        <p>Please connect your MetaMask wallet.</p>
      )}
      <p>Status: {status}</p>
      {contract ? (
        <>
          <CreateCertificate contract={contract} />
          <LogEvent contract={contract} />
          <TransferOwnership contract={contract} />
        </>
      ) : (
        <p>Loading contract... Please wait.</p>
      )}
    </div>
  );
}

export default App;
