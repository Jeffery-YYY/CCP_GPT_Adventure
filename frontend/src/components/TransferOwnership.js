import React, { useState } from "react";

function TransferOwnership({ contract }) {
  const [tokenId, setTokenId] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = async () => {
    try {
      const tx = await contract.transferCertificateOwnership(tokenId, newOwner);
      await tx.wait();
      setMessage(`Ownership transferred for Token ID: ${tokenId}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
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
      <button onClick={handleTransfer}>Transfer</button>
      <p>{message}</p>
    </div>
  );
}

export default TransferOwnership;
