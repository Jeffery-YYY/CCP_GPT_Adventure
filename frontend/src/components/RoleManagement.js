import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function RoleManagement() {
  const [role, setRole] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [queryRole, setQueryRole] = useState("");
  const [hasRole, setHasRole] = useState(null);

  const roleHashes = {
    MINER_ROLE: ethers.utils.id("MINER_ROLE"),
    CUTTER_ROLE: ethers.utils.id("CUTTER_ROLE"),
    GRADER_ROLE: ethers.utils.id("GRADER_ROLE"),
    JEWELER_ROLE: ethers.utils.id("JEWELER_ROLE"),
    CUSTOMER_ROLE: ethers.utils.id("CUSTOMER_ROLE"),
  };

  const roleOptions = Object.keys(roleHashes); // 获取所有角色选项

  const grantRole = async () => {
    if (!ethers.utils.isAddress(userAddress)) {
      alert("Invalid user address");
      return;
    }
    if (!role) {
      alert("Please select a valid role");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.grantRole(roleHashes[role], userAddress, {
        gasLimit: ethers.utils.hexlify(100000),
      });
      await tx.wait();
      alert(`${role} granted to ${userAddress}`);
    } catch (error) {
      console.error("Error granting role:", error);
      alert("Failed to grant role. Check console for details.");
    }
  };

  const revokeRole = async () => {
    if (!ethers.utils.isAddress(userAddress)) {
      alert("Invalid user address");
      return;
    }
    if (!role) {
      alert("Please select a valid role");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.revokeRole(roleHashes[role], userAddress, {
        gasLimit: ethers.utils.hexlify(100000),
      });
      await tx.wait();
      alert(`${role} revoked from ${userAddress}`);
    } catch (error) {
      console.error("Error revoking role:", error);
      alert("Failed to revoke role. Check console for details.");
    }
  };

  const checkRole = async () => {
    if (!ethers.utils.isAddress(queryAddress)) {
      alert("Invalid query address");
      return;
    }
    if (!queryRole) {
      alert("Please select a valid role");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const hasRole = await contract.hasRole(roleHashes[queryRole], queryAddress);
      setHasRole(hasRole);
    } catch (error) {
      console.error("Error checking role:", error);
      alert("Failed to check role. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Role Management</h2>
      {/* Grant or Revoke Role */}
      <div>
        <h3>Grant or Revoke Role</h3>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          {roleOptions.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="User Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
        <button onClick={grantRole}>Grant Role</button>
        <button onClick={revokeRole}>Revoke Role</button>
      </div>

      {/* Check Role */}
      <div>
        <h3>Check Role</h3>
        <select value={queryRole} onChange={(e) => setQueryRole(e.target.value)}>
          <option value="">Select Role</option>
          {roleOptions.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Query Address"
          value={queryAddress}
          onChange={(e) => setQueryAddress(e.target.value)}
        />
        <button onClick={checkRole}>Check Role</button>
        {hasRole !== null && (
          <p>
            Address {queryAddress} has role {queryRole}: {hasRole ? "Yes" : "No"}
          </p>
        )}
      </div>
    </div>
  );
}

export default RoleManagement;