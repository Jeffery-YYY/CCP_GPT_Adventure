import React, { useState } from "react";

function CreateCertificate({ contract }) {
  // 定义组件状态
  const [tokenId, setTokenId] = useState(""); // Token ID
  const [owner, setOwner] = useState(""); // 所有者地址
  const [status, setStatus] = useState(""); // 状态消息
  const [loading, setLoading] = useState(false); // 加载状态

  // 调用智能合约的 createCertificate 方法
  const createCertificate = async () => {
    if (!contract) {
      setStatus("Error: Contract is not initialized."); // 合约未初始化时的提示
      return;
    }

    // 校验输入是否合法
    if (!tokenId || !owner) {
      setStatus("Error: Both Token ID and Owner Address are required."); // 提示输入缺失
      return;
    }

    if (!/^(0x)?[0-9a-fA-F]{40}$/.test(owner)) {
      setStatus("Error: Invalid Ethereum address format."); // 校验地址格式
      return;
    }

    try {
      setLoading(true); // 设置加载状态
      setStatus("Sending transaction to create certificate..."); // 提示交易进行中

      // 调用智能合约
      const tx = await contract.createCertificate(tokenId, owner);
      console.log("Transaction sent:", tx);

      setStatus(`Transaction sent. Hash: ${tx.hash}. Waiting for confirmation...`);

      // 等待交易确认
      await tx.wait();
      console.log("Transaction confirmed:", tx);

      setStatus(`Success: Certificate ${tokenId} created for owner ${owner}!`);
    } catch (error) {
      console.error("Error creating certificate:", error);

      // 提取错误信息
      if (error.data && error.data.message) {
        setStatus(`Error: ${error.data.message}`); // 合约返回的错误信息
      } else {
        setStatus(`Error: ${error.message || "Failed to create certificate."}`); // 一般错误
      }
    } finally {
      setLoading(false); // 恢复加载状态
    }
  };

  // 渲染界面
  return (
    <div className="component">
      <h2>Create Certificate</h2>

      {/* 输入 Token ID */}
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        disabled={loading} // 禁用输入框，避免重复提交
      />

      {/* 输入所有者地址 */}
      <input
        type="text"
        placeholder="Owner Address"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        disabled={loading} // 禁用输入框，避免重复提交
      />

      {/* 提交按钮 */}
      <button onClick={createCertificate} disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>

      {/* 状态提示 */}
      <p>{status}</p>
    </div>
  );
}

export default CreateCertificate;
