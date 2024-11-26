import React, { useState } from "react";
import { getContract } from "../../contract";

function AuthorizeUser() {
  const [userAddress, setUserAddress] = useState(""); // 输入的用户地址
  const [status, setStatus] = useState(""); // 操作状态信息
  const [isAuthorized, setIsAuthorized] = useState(null); // 查询授权状态

  // 授权用户
  const authorizeUser = async () => {
    if (!userAddress || !userAddress.startsWith("0x") || userAddress.length !== 42) {
      setStatus("Please enter a valid Ethereum address.");
      return;
    }

    try {
      const contract = await getContract();
      setStatus("Authorizing user...");
      const tx = await contract.authorizeUser(userAddress); // 调用合约的授权方法
      await tx.wait();
      setStatus(`User ${userAddress} authorized successfully.`);
    } catch (error) {
      console.error("Error authorizing user:", error.message || error);
      setStatus(`Failed to authorize user: ${error.message || error}`);
    }
  };

  // 撤销用户授权
  const revokeUser = async () => {
    if (!userAddress || !userAddress.startsWith("0x") || userAddress.length !== 42) {
      setStatus("Please enter a valid Ethereum address.");
      return;
    }

    try {
      const contract = await getContract();
      setStatus("Revoking user authorization...");
      const tx = await contract.revokeUser(userAddress); // 调用合约的撤销授权方法
      await tx.wait();
      setStatus(`User ${userAddress} authorization revoked successfully.`);
    } catch (error) {
      console.error("Error revoking user:", error.message || error);
      setStatus(`Failed to revoke user: ${error.message || error}`);
    }
  };

  // 检查用户是否被授权
  const checkAuthorization = async () => {
    if (!userAddress || !userAddress.startsWith("0x") || userAddress.length !== 42) {
      setStatus("Please enter a valid Ethereum address.");
      return;
    }

    try {
      const contract = await getContract();
      setStatus("Checking user authorization...");
      const result = await contract.isAuthorized(userAddress); // 调用合约的授权查询方法
      setIsAuthorized(result);
      setStatus(`User ${userAddress} is ${result ? "authorized" : "not authorized"}.`);
    } catch (error) {
      console.error("Error checking authorization:", error.message || error);
      setStatus(`Failed to check authorization: ${error.message || error}`);
    }
  };

  return (
    <div className="component">
      <h2>Authorize User</h2>
      <input
        type="text"
        placeholder="Enter User Address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <button onClick={authorizeUser}>Authorize User</button>
      <button onClick={revokeUser}>Revoke Authorization</button>
      <button onClick={checkAuthorization}>Check Authorization</button>
      <p>{status}</p>
      {isAuthorized !== null && (
        <p>
          <strong>{userAddress}</strong> is{" "}
          <span style={{ color: isAuthorized ? "green" : "red" }}>
            {isAuthorized ? "AUTHORIZED" : "NOT AUTHORIZED"}
          </span>
        </p>
      )}
    </div>
  );
}

export default AuthorizeUser;
