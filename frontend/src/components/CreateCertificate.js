import React, { useState } from "react";
import { ethers } from "ethers";
import contractABI from "../JewelryCertificateABI.json";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function CreateCertificate() {
  const [tokenId, setTokenId] = useState("");
  const [owner, setOwner] = useState("");
  const [message, setMessage] = useState(null); // 存储成功或失败消息
  const [messageType, setMessageType] = useState("success"); // 消息类型：success 或 error
  const [currentStatus, setCurrentStatus] = useState(null); // 存储创建的状态

  const createCertificate = async () => {
    if (!ethers.utils.isAddress(owner)) {
      setMessage("Invalid owner address");
      setMessageType("error");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.createCertificate(tokenId, owner, {
        gasLimit: ethers.utils.hexlify(300000),
      });
      await tx.wait();

      setMessage("Certificate created successfully!");
      setMessageType("success");
      setTokenId(""); // 清空输入框
      setOwner("");

      // 假设合约中会自动初始化为 Mined 状态
      setCurrentStatus("Mined");
    } catch (error) {
      console.error("Error creating certificate:", error);
      setMessage("Failed to create certificate. Check console for details.");
      setMessageType("error");
    }
  };

  return (
    <Card sx={{ margin: 2, padding: 2, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create Certificate
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Use this form to create a new jewelry certificate by specifying the
          token ID and owner address.
        </Typography>
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
            label="Owner Address"
            variant="outlined"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            sx={{ width: "50%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={createCertificate}
            sx={{ width: "50%" }}
          >
            Create Certificate
          </Button>
        </Box>

        {/* 状态显示 */}
        {currentStatus && (
          <Typography
            variant="body1"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Current Status: {currentStatus}
          </Typography>
        )}
      </CardContent>

      {/* 消息显示 */}
      {message && (
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={6000}
          onClose={() => setMessage(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setMessage(null)}
            severity={messageType}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </Card>
  );
}

export default CreateCertificate;