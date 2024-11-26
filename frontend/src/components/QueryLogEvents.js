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
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// 状态映射表
const statusMapping = {
  0: "None",
  1: "Mined",
  2: "Cut",
  3: "Graded",
  4: "Jewelry Made",
};

function QueryLogEvents() {
  const [tokenId, setTokenId] = useState("");
  const [events, setEvents] = useState([]);
  const [alert, setAlert] = useState(null);

  const handleAlert = (message, severity) => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  };

  const fetchEvents = async () => {
    try {
      if (!tokenId) {
        handleAlert("Please enter a valid Token ID.", "error");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const result = await contract.getEvents(tokenId);

      // 解析事件数据，提取 description 和 status
      const parsedEvents = result.map((event) => ({
        description: event.description,
        status: statusMapping[event.status] || "Unknown", // 转换状态值为可读字符串
        timestamp: event.timestamp,
      }));

      setEvents(parsedEvents);
      console.log("Events:", parsedEvents);
      if (parsedEvents.length === 0) {
        handleAlert("No events found for this Token ID.", "info");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      handleAlert("Failed to fetch events. Check console for details.", "error");
    }
  };

  return (
    <Card sx={{ margin: 2, padding: 2, textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Query Log Events
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Enter a Token ID to view the lifecycle events associated with it.
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
          <Button
            variant="contained"
            color="primary"
            onClick={fetchEvents}
            sx={{ width: "50%" }}
          >
            Fetch Events
          </Button>
        </Box>
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Event Logs
          </Typography>
          <List>
            {events.map((event, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: 1,
                  marginBottom: 1,
                }}
              >
                <ListItemText
                  primary={`Description: ${event.description}`}
                  secondary={`Status: ${event.status} | Date: ${new Date(
                    event.timestamp * 1000
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}

export default QueryLogEvents;