module.exports = (sequelize, DataTypes) => {
  const Asteroid = sequelize.define("Asteroid", {
    nasa_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    diameter: DataTypes.FLOAT,
    hazardous: DataTypes.BOOLEAN,
  });

  Asteroid.associate = (models) => {
    Asteroid.belongsToMany(models.User, {
      through: models.Watchlist,
      foreignKey: "nasa_id",
      otherKey: "user_id",
    });
  };

  return Asteroid;
};
