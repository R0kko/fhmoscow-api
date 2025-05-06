'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefereeUserMap extends Model {
    static associate(models) {
      RefereeUserMap.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
      });
    }
  }

  RefereeUserMap.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      referee_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserReferee',
      tableName: 'referee_user_map',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  return RefereeUserMap;
};
