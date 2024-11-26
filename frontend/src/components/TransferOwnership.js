import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function TransferOwnership() {
  const [tokenId, setTokenId] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const transferOwnership = async () => {
    if (!ethers.utils.isAddress(newOwner)) {
      alert("Invalid new owner address");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.transferCertificateOwnership(tokenId, newOwner, {
        gasLimit: ethers.utils.hexlify(200000),
      });
      await tx.wait();
      alert("Ownership transferred successfully!");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      alert("Failed to transfer ownership. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Transfer Ownership</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Owner Address"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
      />
      <button onClick={transferOwnership}>Transfer Ownership</button>
    </div>
  );
}

export default TransferOwnership;