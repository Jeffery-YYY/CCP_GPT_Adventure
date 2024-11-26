import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Typography,
  Toolbar,
  Container,
  Button,
  Tooltip,
  Avatar,
  Paper,
} from "@mui/material";
import {
  AccountCircle,
  Create,
  Event,
  TransferWithinAStation,
  Search,
} from "@mui/icons-material";
import { ethers } from "ethers";
import CreateCertificate from "./components/CreateCertificate";
import LogEvent from "./components/LogEvent";
import TransferOwnership from "./components/TransferOwnership";
import QueryLogEvents from "./components/QueryLogEvents";
import RoleManagement from "./components/RoleManagement";
import contractABI from "./JewelryCertificateABI.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// 固定管理员地址
const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [currentAddress, setCurrentAddress] = useState("");
  const [role, setRole] = useState("");

  const roleHashes = {
    MINER_ROLE: ethers.utils.id("MINER_ROLE"),
    CUTTER_ROLE: ethers.utils.id("CUTTER_ROLE"),
    GRADER_ROLE: ethers.utils.id("GRADER_ROLE"),
    JEWELER_ROLE: ethers.utils.id("JEWELER_ROLE"),
    CUSTOMER_ROLE: ethers.utils.id("CUSTOMER_ROLE"),
  };

  const roleLabels = {
    MINER_ROLE: "Miner",
    CUTTER_ROLE: "Cutter",
    GRADER_ROLE: "Grader",
    JEWELER_ROLE: "Jeweler",
    CUSTOMER_ROLE: "Customer",
  };

  useEffect(() => {
    const fetchAccountAndRole = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setCurrentAddress(address);

        // 检查是否为管理员
        if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          setRole("Admin");
          return;
        }

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        // 检查其他角色
        let assignedRole = "No Role";
        for (const [roleKey, roleHash] of Object.entries(roleHashes)) {
          const hasRole = await contract.hasRole(roleHash, address);
          if (hasRole) {
            assignedRole = roleLabels[roleKey];
            break; // 找到角色后退出循环
          }
        }
        setRole(assignedRole);
      } catch (error) {
        console.error("Error fetching account or role:", error);
      }
    };

    // 仅在 MetaMask 已连接时获取账户和角色
    if (window.ethereum) {
      fetchAccountAndRole();
      window.ethereum.on("accountsChanged", fetchAccountAndRole);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setCurrentAddress(address);

        // 检查是否为管理员
        if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          setRole("Admin");
          return;
        }

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );

        // 检查其他角色
        let assignedRole = "No Role";
        for (const [roleKey, roleHash] of Object.entries(roleHashes)) {
          const hasRole = await contract.hasRole(roleHash, address);
          if (hasRole) {
            assignedRole = roleLabels[roleKey];
            break;
          }
        }
        setRole(assignedRole);
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const disconnectMetaMask = () => {
    setCurrentAddress("");
    setRole("");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 美化后的导航栏 */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #ff6f61, #ff9671)",
          height: 64,
        }}
      >
        <Toolbar
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* 固定标题居中 */}
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Jewelry Certificate Management
          </Typography>
          {currentAddress ? (
            <Tooltip
              title={
                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ color: "white" }}>
                    Address: {currentAddress}
                  </Typography>
                  <Typography sx={{ color: "white", marginTop: 1 }}>
                    Role: {role}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    sx={{ marginTop: 2 }}
                    onClick={disconnectMetaMask}
                  >
                    Disconnect Wallet
                  </Button>
                </Box>
              }
              arrow
              placement="bottom"
            >
              <Avatar sx={{ bgcolor: "#4caf50", cursor: "pointer" }}>
                {role[0]}
              </Avatar>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#42a5f5",
                color: "white",
                "&:hover": { backgroundColor: "#1e88e5" },
              }}
              onClick={connectMetaMask}
            >
              Connect MetaMask
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 添加图标的选项卡 */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="secondary"
        sx={{
          backgroundColor: "#fff176",
          ".MuiTab-root": {
            minWidth: 150,
            fontWeight: "bold",
          },
          ".Mui-selected": {
            color: "#f57f17 !important",
          },
        }}
      >
        <Tab icon={<Create />} label="Create Certificate" />
        <Tab icon={<Event />} label="Log Event" />
        <Tab icon={<TransferWithinAStation />} label="Transfer Ownership" />
        <Tab icon={<Search />} label="Query Log Events" />
        <Tab icon={<AccountCircle />} label="Role Management" />
      </Tabs>

      {/* 选项卡内容区域 */}
      <Container sx={{ marginTop: 4 }}>
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            background: "linear-gradient(135deg, #42a5f5, #ab47bc)",
            borderRadius: 3,
            color: "white",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {tabIndex === 0 && <CreateCertificate />}
          {tabIndex === 1 && <LogEvent />}
          {tabIndex === 2 && <TransferOwnership />}
          {tabIndex === 3 && <QueryLogEvents />}
          {tabIndex === 4 && <RoleManagement />}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;