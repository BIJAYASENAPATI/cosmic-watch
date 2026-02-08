const nasaService = require("../services/nasa_service");

/**
 * Risk calculation logic
 */
const calculateRiskLevel = (asteroid) => {
  const diameter =
    asteroid.estimated_diameter.kilometers.estimated_diameter_max;

  const missDistance =
    parseFloat(
      asteroid.close_approach_data?.[0]?.miss_distance?.kilometers
    ) || Infinity;

  const hazardous = asteroid.is_potentially_hazardous_asteroid;

  if (hazardous && diameter > 0.5 && missDistance < 7500000) {
    return "HIGH";
  }

  if (hazardous || diameter > 0.3 || missDistance < 15000000) {
    return "MEDIUM";
  }

  return "LOW";
};

exports.getTodayAsteroids = async (req, res) => {
  try {
    const asteroidsByDate = await nasaService.getAsteroidFeed();

    // Flatten NASA grouped data
    const asteroids = Object.values(asteroidsByDate).flat();

    const formatted = asteroids.map((a) => ({
      nasa_id: a.id,
      name: a.name,
      diameter:
        a.estimated_diameter.kilometers.estimated_diameter_max,
      hazardous: a.is_potentially_hazardous_asteroid,

      velocity_kmph: Number(
        a.close_approach_data?.[0]?.relative_velocity
          ?.kilometers_per_hour
      ),

      miss_distance_km: Number(
        a.close_approach_data?.[0]?.miss_distance?.kilometers
      ),

      close_approach_date:
        a.close_approach_data?.[0]?.close_approach_date,

      risk_level: calculateRiskLevel(a),
    }));


    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch asteroid data",
    });
  }
};



/**
 * GET upcoming close-approach alerts (next 7 days)
 */
exports.getUpcomingAlerts = async (req, res) => {
  try {
    // 1️⃣ Fetch NASA data
    const asteroidsByDate = await nasaService.getAsteroidFeed();

    // 2️⃣ Flatten grouped data
    const asteroids = Object.values(asteroidsByDate).flat();

    // 3️⃣ Date range: today → next 7 days
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    // 4️⃣ Filter upcoming close approaches
    const alerts = asteroids
      .map((a) => {
        const approach = a.close_approach_data?.[0];
        if (!approach) return null;

        const approachDate = new Date(approach.close_approach_date);

        if (approachDate >= today && approachDate <= next7Days) {
          return {
            name: a.name,
            close_approach_date: approach.close_approach_date,
            risk_level: a.is_potentially_hazardous_asteroid
              ? "HIGH"
              : "LOW",
            miss_distance_km: Number(
              approach.miss_distance.kilometers
            ),
          };
        }

        return null;
      })
      .filter(Boolean);

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming alerts",
    });
  }
};
