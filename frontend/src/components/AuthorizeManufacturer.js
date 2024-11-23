import React, { useState } from "react";

function AuthorizeManufacturer({ contract, fetchAuthorizedManufacturers }) {
  const [manufacturer, setManufacturer] = useState("");

  const authorize = async () => {
    try {
      const tx = await contract.authorizeManufacturer(manufacturer);
      await tx.wait();
      alert("Manufacturer authorized successfully!");
      fetchAuthorizedManufacturers();
    } catch (error) {
      console.error("Error authorizing manufacturer:", error);
      alert("Failed to authorize manufacturer. See console for details.");
    }
  };

  const revoke = async () => {
    try {
      const tx = await contract.revokeManufacturer(manufacturer);
      await tx.wait();
      alert("Manufacturer revoked successfully!");
      fetchAuthorizedManufacturers();
    } catch (error) {
      console.error("Error revoking manufacturer:", error);
      alert("Failed to revoke manufacturer. See console for details.");
    }
  };

  return (
    <div>
      <h3>Authorize or Revoke Manufacturer</h3>
      <input
        type="text"
        placeholder="Manufacturer Address"
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
      />
      <button onClick={authorize}>Authorize</button>
      <button onClick={revoke}>Revoke</button>
    </div>
  );
}

export default AuthorizeManufacturer;
