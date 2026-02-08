const { User, Notification } = require("../db/db");
const nasaService = require("./nasa_service");

// Check for upcoming asteroids and create notifications
exports.checkUpcomingAsteroids = async () => {
  try {
    const asteroidsByDate = await nasaService.getAsteroidFeed();
    const asteroids = Object.values(asteroidsByDate).flat();

    // Only HIGH risk
    const highRiskAsteroids = asteroids.filter(
      (a) => a.is_potentially_hazardous_asteroid
    );

    const users = await User.findAll();

    for (const a of highRiskAsteroids) {
      const approach = a.close_approach_data?.[0];
      if (!approach) continue;

      for (const user of users) {
        const message = `Asteroid ${a.name} will approach Earth on ${approach.close_approach_date}. Risk level: HIGH`;

        // Avoid duplicates
        const exists = await Notification.findOne({
          where: { user_id: user.id, nasa_id: a.id },
        });

        if (!exists) {
          await Notification.create({
            user_id: user.id,
            nasa_id: a.id,
            message,
          });
        }
      }
    }
  } catch (err) {
    console.error("Notification check failed:", err);
  }
};
