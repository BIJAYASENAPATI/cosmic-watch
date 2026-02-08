require("dotenv").config();

const { Sequelize } = require("sequelize");

//  Import Node Utilities
const fs = require("fs");
const path = require("path");

//  Debug Environment Variables
console.log(
  "Connecting to the database...",
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_HOST,
  process.env.PORT
);

//  Create Sequelize Instance (DB Connection)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    port: 3306,
  }
);

// Create DB Object Container
const db = {};

//  Create DB Object Container
const modelsDir = path.join(__dirname, "../models");

//  Dynamically Load All Models
fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Setup associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Test DB connection only (sync disabled)
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
    // 🚫 Disabled sync to avoid duplicate indexes issue
    // return sequelize.sync({ alter: true });
  })
  // .then(() => {
  //   console.log("✅ Models synchronized with DB");
  // })
  .catch((err) => {
    console.error("❌ Unable to connect to DB:", err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db