const db = require("../db/db");
const { Notification } = db;

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });

    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification || notification.user_id !== req.user.id) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
