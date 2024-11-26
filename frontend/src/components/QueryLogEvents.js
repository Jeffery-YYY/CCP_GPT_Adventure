import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function QueryLogEvents() {
  const [tokenId, setTokenId] = useState("");
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const result = await contract.getEvents(tokenId);
      setEvents(result);
      console.log("Events:", result);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to fetch events. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Query Log Events</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <button onClick={fetchEvents}>Fetch Events</button>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.description} - {new Date(event.timestamp * 1000).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default QueryLogEvents;