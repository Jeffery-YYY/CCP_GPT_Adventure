import React, { useState } from "react";

function CreateCertificate({ contract }) {
  const [tokenId, setTokenId] = useState("");
  const [owner, setOwner] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      const tx = await contract.createCertificate(tokenId, owner);
      await tx.wait();
      setMessage(`Certificate created for Token ID: ${tokenId}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
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
      <button onClick={handleCreate}>Create</button>
      <p>{message}</p>
    </div>
  );
}

export default CreateCertificate;
