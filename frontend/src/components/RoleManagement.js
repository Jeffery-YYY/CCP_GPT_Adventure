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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function RoleManagement() {
  const [role, setRole] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [queryRole, setQueryRole] = useState("");
  const [hasRole, setHasRole] = useState(null);
  const [alert, setAlert] = useState(null);

  const roleHashes = {
    MINER_ROLE: ethers.utils.id("MINER_ROLE"),
    CUTTER_ROLE: ethers.utils.id("CUTTER_ROLE"),
    GRADER_ROLE: ethers.utils.id("GRADER_ROLE"),
    JEWELER_ROLE: ethers.utils.id("JEWELER_ROLE"),
    CUSTOMER_ROLE: ethers.utils.id("CUSTOMER_ROLE"),
  };

  const roleOptions = Object.keys(roleHashes);

  const handleAlert = (message, severity) => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  };

  const grantRole = async () => {
    if (!ethers.utils.isAddress(userAddress)) {
      handleAlert("Invalid user address", "error");
      return;
    }
    if (!role) {
      handleAlert("Please select a valid role", "error");
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
      handleAlert(`${role} granted to ${userAddress}`, "success");
    } catch (error) {
      console.error("Error granting role:", error);
      handleAlert("Failed to grant role. Check console for details.", "error");
    }
  };

  const revokeRole = async () => {
    if (!ethers.utils.isAddress(userAddress)) {
      handleAlert("Invalid user address", "error");
      return;
    }
    if (!role) {
      handleAlert("Please select a valid role", "error");
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
      handleAlert(`${role} revoked from ${userAddress}`, "success");
    } catch (error) {
      console.error("Error revoking role:", error);
      handleAlert("Failed to revoke role. Check console for details.", "error");
    }
  };

  const checkRole = async () => {
    if (!ethers.utils.isAddress(queryAddress)) {
      handleAlert("Invalid query address", "error");
      return;
    }
    if (!queryRole) {
      handleAlert("Please select a valid role", "error");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const hasRole = await contract.hasRole(roleHashes[queryRole], queryAddress);
      setHasRole(hasRole);
    } catch (error) {
      console.error("Error checking role:", error);
      handleAlert("Failed to check role. Check console for details.", "error");
    }
  };

  return (
    <Card sx={{ margin: 2, padding: 2, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Role Management
        </Typography>
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}

        {/* Grant or Revoke Role */}
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Grant or Revoke Role
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
            <FormControl sx={{ width: "50%" }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
              >
                {roleOptions.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="User Address"
              variant="outlined"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              sx={{ width: "50%" }}
            />
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="contained" color="primary" onClick={grantRole}>
                Grant Role
              </Button>
              <Button variant="contained" color="error" onClick={revokeRole}>
                Revoke Role
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Check Role */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Check Role
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
            <FormControl sx={{ width: "50%" }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={queryRole}
                onChange={(e) => {
                  setQueryRole(e.target.value);
                  setHasRole(null); // 清除上一次查找的结果
                }}
                fullWidth
              >
                {roleOptions.map((roleOption) => (
                  <MenuItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Query Address"
              variant="outlined"
              value={queryAddress}
              onChange={(e) => setQueryAddress(e.target.value)}
              sx={{ width: "50%" }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={checkRole}
              sx={{ width: "50%" }}
            >
              Check Role
            </Button>
            {hasRole !== null && (
              <Typography>
                Address {queryAddress} has role {queryRole}:{" "}
                {hasRole ? "Yes" : "No"}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RoleManagement;