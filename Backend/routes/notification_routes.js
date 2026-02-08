const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification_controller");
const authMiddleware = require("../middlewares/auth_middleware");

// GET all notifications
router.get("/", authMiddleware, notificationController.getNotifications);

// MARK notification as read
router.put("/:id/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
