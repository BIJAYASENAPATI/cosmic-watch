const express = require("express");
const router = express.Router();

const asteroidController = require("../controllers/asteroid_controller");
const authMiddleware = require("../middlewares/auth_middleware");


// GET today's asteroid feed
router.get("/feed", authMiddleware, asteroidController.getTodayAsteroids);

// Upcoming close-approach alerts
router.get("/alerts/upcoming", authMiddleware, asteroidController.getUpcomingAlerts);


module.exports = router;
