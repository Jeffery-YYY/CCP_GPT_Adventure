import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function LogEvent() {
  const [tokenId, setTokenId] = useState("");
  const [description, setDescription] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const validStatuses = ["cut", "graded", "jewelry made"]; // 预定义的状态

  const logEvent = async () => {
    if (!validStatuses.includes(newStatus)) {
      alert(`Invalid status. Please select one of: ${validStatuses.join(", ")}`);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      console.log("Token ID:", tokenId);
      console.log("Description:", description);
      console.log("New Status:", newStatus);
      console.log("Current Address:", currentAddress);

      // 检查账户权限
      const hasRole = await contract.hasRole(ethers.utils.id("CUTTER_ROLE"), currentAddress);
      console.log("Has CUTTER_ROLE:", hasRole);
      if (!hasRole) {
        alert("You do not have the required role to log events.");
        return;
      }

      // 调用合约方法
      const tx = await contract.logEvent(tokenId, description, newStatus, {
        gasLimit: ethers.utils.hexlify(200000),
      });
      console.log("Transaction Hash:", tx.hash);
      await tx.wait();
      alert("Event logged successfully!");
    } catch (error) {
      console.error("Error logging event:", error);

      if (error.data) {
        console.error("Error data:", error.data);
        if (error.data.message) {
          alert(`Error: ${error.data.message}`);
        }
      } else if (error.reason) {
        console.error("Error reason:", error.reason);
        alert(`Error: ${error.reason}`);
      } else {
        console.error("Full Error Object:", JSON.stringify(error, null, 2));
        alert("Failed to log event. Check the console for details.");
      }
    }
  };

  return (
    <div>
      <h2>Log Event</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        <option value="">Select New Status</option>
        {validStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button onClick={logEvent}>Log Event</button>
    </div>
  );
}

export default LogEvent;