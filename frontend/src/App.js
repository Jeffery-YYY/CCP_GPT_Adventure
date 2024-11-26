import React from "react";
import CreateCertificate from "./components/CreateCertificate";
import LogEvent from "./components/LogEvent";
import TransferOwnership from "./components/TransferOwnership";
import QueryLogEvents from "./components/QueryLogEvents";
import RoleManagement from "./components/RoleManagement"; // 已合并授权功能

function App() {
  return (
    <div className="app">
      <h1>Jewelry Certificate Management</h1>
      {/* Role Management: 包含授予、撤销和检查角色的功能 */}
      <RoleManagement />
      {/* Create Certificate: 创建证书 */}
      <CreateCertificate />
      {/* Log Event: 记录事件 */}
      <LogEvent />
      {/* Transfer Ownership: 转移证书所有权 */}
      <TransferOwnership />
      {/* Query Log Events: 查询证书事件日志 */}
      <QueryLogEvents />
    </div>
  );
}

export default App;