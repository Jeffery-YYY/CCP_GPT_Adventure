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
  Alert,
} from "@mui/material";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function TransferOwnership() {
  const [tokenId, setTokenId] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [alert, setAlert] = useState(null);

  const handleAlert = (message, severity) => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  };

  const transferOwnership = async () => {
    if (!ethers.utils.isAddress(newOwner)) {
      handleAlert("Invalid new owner address", "error");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.transferCertificateOwnership(tokenId, newOwner, {
        gasLimit: ethers.utils.hexlify(200000),
      });
      await tx.wait();
      handleAlert("Ownership transferred successfully!", "success");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      handleAlert("Failed to transfer ownership. Check console for details.", "error");
    }
  };

  return (
    <Card sx={{ margin: 2, padding: 2, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Transfer Ownership
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter the Token ID and new owner's address to transfer ownership.
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
            label="New Owner Address"
            variant="outlined"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            sx={{ width: "50%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={transferOwnership}
            sx={{ width: "50%" }}
          >
            Transfer Ownership
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TransferOwnership;