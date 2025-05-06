'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefereeGameConfirmation extends Model {
    static associate(models) {
      RefereeGameConfirmation.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
        constraints: false,
      });
    }
  }

  RefereeGameConfirmation.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      referee_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
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
      modelName: 'RefereeGameConfirmation',
      tableName: 'referee_games_confirmation',
      underscored: true,
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['game_id'] },
        { fields: ['referee_id'] },
        { fields: ['user_id'] },
        {
          unique: true,
          name: 'unique_game_referee_confirmation',
          fields: ['game_id', 'referee_id'],
        },
      ],
    }
  );

  return RefereeGameConfirmation;
};
