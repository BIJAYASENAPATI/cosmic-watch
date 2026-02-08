const express = require("express");
const router = express.Router();

const watchlistController = require("../controllers/watchlist_controller");
const authMiddleware = require("../middlewares/auth_middleware");

// router.get("/", authMiddleware, watchlistController.getWatchlist);
// router.post("/", authMiddleware, watchlistController.addToWatchlist);
// router.delete("/:nasa_id", authMiddleware, watchlistController.removeFromWatchlist);

// GET all watched asteroids for logged-in user
router.get("/", authMiddleware, watchlistController.getWatchlist);

// ADD asteroid to watchlist
router.post("/", authMiddleware, watchlistController.addToWatchlist);

// REMOVE asteroid from watchlist
router.delete("/:nasa_id", authMiddleware, watchlistController.removeFromWatchlist);

module.exports = router;
