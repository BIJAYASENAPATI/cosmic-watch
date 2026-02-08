const db = require("../db/db");
const { User, Asteroid } = db;

/**
 * GET user watchlist
 */
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Asteroid,
        through: { attributes: [] },
      },
    });

    res.json({
      success: true,
      data: user ? user.Asteroids : [],
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
};

/**
 * ADD asteroid to watchlist
 */
exports.addToWatchlist = async (req, res) => {
  try {
    const { nasa_id, name, diameter, hazardous, risk_level } = req.body;

    const [asteroid] = await Asteroid.findOrCreate({
      where: { nasa_id },
      defaults: { name, diameter, hazardous, risk_level },
    });

    const user = await User.findByPk(req.user.id);
    await user.addAsteroid(asteroid);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to watchlist" });
  }
};

/**
 * REMOVE asteroid from watchlist
 */
exports.removeFromWatchlist = async (req, res) => {
  try {
    const asteroid = await Asteroid.findByPk(req.params.nasa_id);
    const user = await User.findByPk(req.user.id);

    if (asteroid) {
      await user.removeAsteroid(asteroid);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from watchlist" });
  }
};
