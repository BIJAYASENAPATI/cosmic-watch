module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    "Notification",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nasa_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "notifications",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Notification;
};
