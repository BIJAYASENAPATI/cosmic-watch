require('dotenv').config();
const express = require('express');
const cors = require("cors");
const cron = require("node-cron");
const app = express();

app.use(express.json());

require("./db/db");

app.use(cors());

const notificationService = require("./services/notification_service");

// ROUTES
const asteroidRoutes = require("./routes/asteroid_routes");
const authRoutes = require("./routes/auth_routes");
const watchlistRoutes = require("./routes/watchlist_routes");
const notificationRoutes = require("./routes/notification_routes");
const chatRoutes = require("./routes/chat_routes");

// Mount routes
app.use("/api/asteroids", asteroidRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

// 1️⃣ Daily summary at 8 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Running daily asteroid summary at 8 AM...");
  await notificationService.checkUpcomingAsteroids();
});

// 2️⃣ High-risk immediate check every 10 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("Checking for high-risk asteroids every 10 minutes...");
  await notificationService.checkUpcomingAsteroids();
});

app.listen(process.env.PORT,  () =>{
    console.log(`Server running on ${process.env.PORT}`);
})