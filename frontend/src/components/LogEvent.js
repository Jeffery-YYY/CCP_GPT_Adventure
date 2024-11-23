import React, { useState } from "react";

function LogEvent({ contract }) {
  const [tokenId, setTokenId] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleLogEvent = async () => {
    try {
      const tx = await contract.logEvent(tokenId, description);
      await tx.wait();
      setMessage(`Event logged for Token ID: ${tokenId}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
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
      <button onClick={handleLogEvent}>Log Event</button>
      <p>{message}</p>
    </div>
  );
}

export default LogEvent;
