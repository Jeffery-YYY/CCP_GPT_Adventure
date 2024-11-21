import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import config from "./config";
import contractABI from "./artifacts/contracts/JewelryCertificate.json";

function App() {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [owner, setOwner] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                // 检查以太坊环境
                if (!window.ethereum) {
                    throw new Error("MetaMask is not installed!");
                }

                // 连接到 MetaMask
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                // 初始化合约
                const deployedContract = new ethers.Contract(config.contractAddress, contractABI.abi, signer);
                setContract(deployedContract);

                // 获取账户
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Initialization error:", error);
                setMessage("Failed to initialize the DApp.");
            }
        };
        init();
    }, []);

    const createCertificate = async () => {
        if (contract) {
            try {
                const tx = await contract.createCertificate(tokenId, owner);
                await tx.wait();
                setMessage(`Certificate ${tokenId} created successfully!`);
            } catch (error) {
                console.error("Error creating certificate:", error);
                setMessage("Error creating certificate.");
            }
        }
    };

    const logEvent = async () => {
        if (contract) {
            try {
                const description = `Event for token ${tokenId}`;
                const tx = await contract.logEvent(tokenId, description);
                await tx.wait();
                setMessage(`Event logged for token ${tokenId}.`);
            } catch (error) {
                console.error("Error logging event:", error);
                setMessage("Error logging event.");
            }
        }
    };

    return (
        <div>
            <h1>Jewelry Certificate DApp</h1>
            <p>Connected Account: {account || "Not connected"}</p>

            <div>
                <label>Token ID: </label>
                <input
                    type="text"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="Enter Token ID"
                />
            </div>
            <div>
                <label>Owner Address: </label>
                <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="Enter Owner Address"
                />
            </div>
            <button onClick={createCertificate}>Create Certificate</button>
            <button onClick={logEvent}>Log Event</button>

            <p>{message}</p>
        </div>
    );
}

export default App;
