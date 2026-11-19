const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { sequelize } = require("./models"); // Import Sequelize instance
const setupWebSocket  = require("./utils/websocket");

console.log("setupWebSocket:", setupWebSocket); // Debug log

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
require('./services/updateWaitTimeJob');


// Import Routes
const atmRoutes = require("./routes/atmRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userRoutes");
const getQueueData = require("./routes/queueRouter");
const reportRoutes = require("./routes/reportRoutes");


// Use Routes
app.use("/api/atms", atmRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/queue", getQueueData);
app.use('/api/reports', reportRoutes);

// Create HTTP server and pass to WebSocket
const server = http.createServer(app);
setupWebSocket(server);

// Sync Database (create/update tables to match models)
sequelize.authenticate()
    .then(() => {
        console.log("Database connected...");
        return sequelize.sync({ alter: true });
    })
    .then(() => console.log("Database synchronized"))
    .catch(err => console.error("Sequelize sync error:", err));

// Start Server
const PORT = process.env.PORT || 2000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => {
    console.log(`Server and WebSocket running on port ${PORT}`);
});
