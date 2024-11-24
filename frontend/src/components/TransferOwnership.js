import React, { useState } from "react";

function TransferOwnership({ contract }) {
  // 定义组件状态
  const [tokenId, setTokenId] = useState(""); // 用户输入的 Token ID
  const [newOwner, setNewOwner] = useState(""); // 用户输入的新所有者地址
  const [status, setStatus] = useState(""); // 显示操作状态
  const [loading, setLoading] = useState(false); // 按钮加载状态

  // 定义函数，用于调用智能合约的 transferCertificateOwnership 方法
  const transferOwnership = async () => {
    // 输入验证
    if (!tokenId.trim() || !newOwner.trim()) {
      setStatus("Error: Token ID and New Owner Address are required.");
      return;
    }

    if (isNaN(tokenId) || Number(tokenId) < 0) {
      setStatus("Error: Token ID must be a valid non-negative number."); // 校验 Token ID 是否有效
      return;
    }

    setLoading(true); // 开始加载
    setStatus("Processing ownership transfer..."); // 提示状态更新

    try {
      // 确认合约是否已初始化
      if (!contract) {
        throw new Error("Error: Contract not initialized.");
      }

      // 调用智能合约的 transferCertificateOwnership 方法
      const tx = await contract.transferCertificateOwnership(tokenId, newOwner);
      console.log("Transaction sent:", tx); // 打印交易信息

      setStatus(`Transaction sent. Hash: ${tx.hash}. Waiting for confirmation...`);

      // 等待交易被区块链确认
      await tx.wait();
      console.log("Transaction confirmed:", tx); // 打印确认信息

      // 显示成功状态
      setStatus(`Success: Ownership of Token ID ${tokenId} transferred to ${newOwner}.`);
    } catch (error) {
      console.error("Error transferring ownership:", error); // 打印错误信息

      // 处理详细错误信息
      const errorMessage = error.data?.message || error.message || "An unexpected error occurred.";
      setStatus(`Error: Failed to transfer ownership: ${errorMessage}`);
    } finally {
      setLoading(false); // 恢复按钮状态
    }
  };

  // 渲染组件界面
  return (
    <div className="component">
      <h2>Transfer Ownership</h2>
      <div>
        {/* 输入 Token ID */}
        <label>
          Token ID:
          <input
            type="text"
            placeholder="Enter Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value.trim())} // 去除多余空格
            disabled={loading} // 禁用输入框
          />
        </label>
      </div>
      <div>
        {/* 输入新所有者地址 */}
        <label>
          New Owner Address:
          <input
            type="text"
            placeholder="Enter New Owner Address"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value.trim())} // 去除多余空格
            disabled={loading} // 禁用输入框
          />
        </label>
      </div>
      {/* 提交按钮 */}
      <button onClick={transferOwnership} disabled={loading || !contract}>
        {loading ? "Transferring..." : "Transfer"} {/* 按钮动态文本 */}
      </button>
      {/* 显示状态消息 */}
      {status && <p>{status}</p>}
    </div>
  );
}

export default TransferOwnership;
