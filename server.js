const crypto = require("crypto");
const express = require("express");
const app = express();
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

// Store connections to multiple clients
const clients = new Map();

wss.on("connection", (ws) => {
  // Add the newly connected client to the set
  const uuid = crypto.randomUUID();
  console.log("Connecting", uuid);
  ws.send(JSON.stringify({ uid: uuid, type: "connection-open" }));
  clients.set(uuid, ws);
  console.log("Connections", clients.size);

  ws.on("message", (message) => {
    // Forward the message to other clients
    console.log("message : " + message.toString());
    const to = JSON.parse(message).to;
    console.log("message to: " + to.toString());

    const client = clients.get(to.toString());
    if (client !== ws) {
      client.send(message.toString());
    }
  });

  ws.on("close", () => {
    // Remove the disconnected client from the set
    clients.delete(ws);
    console.log("Websocket closed");
  });

  ws.on("open", () => {
    console.log("Websocket openned");
  });
});

// server.listen(port, () => {
//     console.log(`Socket.IO server listening on port ${port}`);
//   });
