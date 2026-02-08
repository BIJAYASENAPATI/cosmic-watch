module.exports = (sequelize, DataTypes) => {
    const Watchlist = sequelize.define(
        "Watchlist",
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nasa_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: "watchlists",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: false,
            indexes: [
                {
                    unique: true,
                    fields: ["user_id", "nasa_id"],
                },
            ],
        }
    );

    return Watchlist;
};
