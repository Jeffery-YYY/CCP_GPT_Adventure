import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import CreateCertificate from "./components/CreateCertificate";
import LogEvent from "./components/LogEvent";
import TransferOwnership from "./components/TransferOwnership";
import FetchTokenURI from "./components/FetchTokenURI";
import AuthorizeManufacturer from "./components/AuthorizeManufacturer";
import config from "./config";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [authorizedManufacturers, setAuthorizedManufacturers] = useState([]);

  // 初始化钱包连接
  useEffect(() => {
    const initWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(ethersProvider);

          // 请求账户授权
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const ethersSigner = ethersProvider.getSigner();
          setSigner(ethersSigner);

          // 初始化合约
          const ethersContract = new ethers.Contract(config.contractAddress, config.abi, ethersSigner);
          setContract(ethersContract);

          // 获取授权制造商
          await fetchAuthorizedManufacturers(ethersContract);
        } catch (err) {
          console.error("Error connecting to wallet:", err);
        }
      } else {
        alert("MetaMask is not installed. Please install it to use this DApp.");
      }
    };

    initWalletConnection();
  }, []);

  // 检测账户切换
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        window.location.reload();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  // 获取授权制造商
  const fetchAuthorizedManufacturers = async (contractInstance) => {
    try {
      const manufacturers = [];
      const filter = contractInstance.filters.AuthorizedManufacturerChanged();
      const events = await contractInstance.queryFilter(filter);
      
      events.forEach((event) => {
        const { manufacturer, status } = event.args;
        if (status) {
          manufacturers.push(manufacturer);
        } else {
          const index = manufacturers.indexOf(manufacturer);
          if (index > -1) {
            manufacturers.splice(index, 1);
          }
        }
      });

      setAuthorizedManufacturers(manufacturers);
    } catch (error) {
      console.error("Error fetching authorized manufacturers:", error);
    }
  };

  return (
    <div>
      <h1>Diamond Tracking DApp</h1>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <p>Please connect your MetaMask wallet.</p>
      )}
      {contract ? (
        <>
          <CreateCertificate contract={contract} />
          <LogEvent contract={contract} />
          <TransferOwnership contract={contract} />
          <FetchTokenURI contract={contract} />
          <AuthorizeManufacturer contract={contract} fetchAuthorizedManufacturers={fetchAuthorizedManufacturers} />
          <div>
            <h3>Authorized Manufacturers</h3>
            <ul>
              {authorizedManufacturers.length > 0 ? (
                authorizedManufacturers.map((manufacturer, index) => (
                  <li key={index}>{manufacturer}</li>
                ))
              ) : (
                <p>No authorized manufacturers found.</p>
              )}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading contract...</p>
      )}
    </div>
  );
}

export default App;
