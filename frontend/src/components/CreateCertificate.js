import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function CreateCertificate() {
  const [tokenId, setTokenId] = useState("");
  const [owner, setOwner] = useState("");

  const createCertificate = async () => {
    if (!ethers.utils.isAddress(owner)) {
      alert("Invalid owner address");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.createCertificate(tokenId, owner, {
        gasLimit: ethers.utils.hexlify(300000),
      });
      await tx.wait();
      alert("Certificate created successfully!");
    } catch (error) {
      console.error("Error creating certificate:", error);
      alert("Failed to create certificate. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Create Certificate</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Owner Address"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />
      <button onClick={createCertificate}>Create Certificate</button>
    </div>
  );
}

export default CreateCertificate;