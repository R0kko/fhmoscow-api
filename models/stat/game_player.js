module.exports = (sequelize, DataTypes) => {
  const GamePlayer = sequelize.define(
    'GamePlayer',
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

      player_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      position_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'game_player',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'game_index', fields: ['game_id'] },
        { name: 'player_index', fields: ['player_id'] },
        { name: 'team_index', fields: ['team_id'] },
        { name: 'objectStatus_index', fields: ['object_status'] },
      ],
    }
  );

  GamePlayer.associate = (models) => {
    GamePlayer.belongsTo(models.Game, {
      as: 'game',
      foreignKey: 'game_id',
      constraints: false,
    });

    GamePlayer.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'team_id',
      constraints: false,
    });

    GamePlayer.belongsTo(models.Player, {
      as: 'player',
      foreignKey: 'player_id',
      constraints: false,
    });

    if (models.PlayerPosition) {
      GamePlayer.belongsTo(models.PlayerPosition, {
        as: 'position',
        foreignKey: 'position_id',
        constraints: false,
      });
    }
  };

  return GamePlayer;
};
