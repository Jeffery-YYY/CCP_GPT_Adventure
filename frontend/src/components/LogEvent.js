import React, { useState } from "react";

function LogEvent({ contract }) {
  // 定义组件状态
  const [tokenId, setTokenId] = useState(""); // 用户输入的 Token ID
  const [description, setDescription] = useState(""); // 用户输入的事件描述
  const [status, setStatus] = useState(""); // 显示当前操作的状态
  const [loading, setLoading] = useState(false); // 控制按钮加载状态

  // 定义函数，用于调用智能合约的 logEvent 方法
  const logEvent = async () => {
    // 检查用户输入
    if (!tokenId || !description) {
      setStatus("Error: Token ID and Event Description are required."); // 提示用户输入完整信息
      return;
    }

    if (isNaN(tokenId) || Number(tokenId) < 0) {
      setStatus("Error: Token ID must be a valid non-negative number."); // 校验 Token ID 是否有效
      return;
    }

    setLoading(true); // 开始加载
    setStatus("Processing event log..."); // 设置状态提示

    try {
      // 确认合约是否加载成功
      if (!contract) {
        throw new Error("Error: Contract is not initialized.");
      }

      // 调用智能合约 logEvent 方法
      const tx = await contract.logEvent(tokenId, description);
      console.log("Transaction sent:", tx); // 输出交易对象到控制台

      setStatus(`Transaction sent. Hash: ${tx.hash}. Waiting for confirmation...`);

      // 等待交易被区块链确认
      await tx.wait();
      console.log("Transaction confirmed:", tx); // 输出确认信息到控制台

      // 显示成功状态
      setStatus(`Success: Event logged for Token ID ${tokenId} with description "${description}"`);
    } catch (error) {
      console.error("Error logging event:", error); // 输出错误信息到控制台

      // 显示详细错误信息
      if (error.data && error.data.message) {
        setStatus(`Error: ${error.data.message}`); // 合约返回的错误信息
      } else {
        setStatus(`Error: Failed to log event: ${error.message || "Unknown error."}`); // 其他错误信息
      }
    } finally {
      setLoading(false); // 停止加载
    }
  };

  // 渲染组件界面
  return (
    <div className="component">
      <h2>Log Event</h2>
      {/* 输入 Token ID */}
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)} // 设置 Token ID 的状态
        disabled={loading} // 加载时禁用输入框
      />
      {/* 输入事件描述 */}
      <input
        type="text"
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)} // 设置事件描述的状态
        disabled={loading} // 加载时禁用输入框
      />
      {/* 提交按钮 */}
      <button onClick={logEvent} disabled={loading}>
        {loading ? "Logging..." : "Log Event"} {/* 根据状态显示按钮文本 */}
      </button>
      {/* 显示状态消息 */}
      <p>{status}</p>
    </div>
  );
}

export default LogEvent;
