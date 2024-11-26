import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function LogEvent() {
  const [tokenId, setTokenId] = useState("");
  const [description, setDescription] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [alert, setAlert] = useState(null);

  // 状态映射表
  const validStatuses = {
    mined: 1,
    cut: 2,
    graded: 3,
    "jewelry made": 4,
  };

  // 显示提示消息
  const handleAlert = (message, severity) => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  };

  // 日志事件处理
  const logEvent = async () => {
    if (!Object.keys(validStatuses).includes(newStatus)) {
      handleAlert(
        `Invalid status. Please select one of: ${Object.keys(validStatuses).join(", ")}`,
        "error"
      );
      return;
    }

    if (isNaN(tokenId) || tokenId <= 0) {
      handleAlert("Token ID must be a positive number.", "error");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      console.log("Token ID:", tokenId);
      console.log("Description:", description);
      console.log("New Status:", newStatus);
      console.log("Current Address:", currentAddress);

      // 获取枚举值
      const statusValue = validStatuses[newStatus];

      // 调用合约方法
      const tx = await contract.logEvent(
        parseInt(tokenId),
        description,
        statusValue,
        { gasLimit: ethers.utils.hexlify(300000) }
      );

      console.log("Transaction Hash:", tx.hash);
      await tx.wait();
      handleAlert("Event logged successfully!", "success");
    } catch (error) {
      console.error("Error logging event:", error);
      handleAlert("Failed to log event. Check the console for details.", "error");
    }
  };

  return (
    <Card sx={{ margin: 2, padding: 2, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Log Event
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Use this form to log lifecycle events for a specific certificate.
        </Typography>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            marginTop: 2,
          }}
        >
          <TextField
            label="Token ID"
            variant="outlined"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            sx={{ width: "50%" }}
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ width: "50%" }}
          />
          <FormControl sx={{ width: "50%" }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.keys(validStatuses).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={logEvent}
            sx={{ width: "50%" }}
          >
            Log Event
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default LogEvent;