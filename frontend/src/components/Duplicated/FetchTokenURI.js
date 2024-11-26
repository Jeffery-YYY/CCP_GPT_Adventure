import React, { useState } from "react";

function FetchTokenURI({ contract }) {
  const [tokenId, setTokenId] = useState("");
  const [uri, setUri] = useState("");

  const fetchTokenURI = async () => {
    try {
      const result = await contract.tokenURI(tokenId);
      setUri(result);
    } catch (error) {
      setUri(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Fetch Token URI</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={fetchTokenURI}>Get Token URI</button>
      <p>{uri}</p>
    </div>
  );
}

export default FetchTokenURI;
