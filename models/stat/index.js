const fs = require('fs');
const path = require('path');

const { Sequelize, DataTypes } = require('sequelize');

const config = require('../../config/config.js').mariaExternal;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
