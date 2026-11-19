// websocket.js
const WebSocket = require("ws");
const { handleQueueUpdate } = require("../controllers/queueController");

 const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("[WS] Client connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        if (data.type === "queue_update") {
          console.log("[WS] Queue Count Received:", data.count);
          handleQueueUpdate(data);
        }
      } catch (err) {
        console.error("[WS] Message Error:", err);
      }
    });

    ws.on("close", () => {
      console.log("[WS] Client disconnected");
    });
  });

  return wss;
};

module.exports = setupWebSocket;
