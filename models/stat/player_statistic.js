module.exports = (sequelize, DataTypes) => {
  const PlayerStatistic = sequelize.define(
    'PlayerStatistic',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      /* FK-поля */
      season_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      tournament_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      player_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      /* показатели */
      goal: { type: DataTypes.INTEGER, allowNull: true },
      assist: { type: DataTypes.INTEGER, allowNull: true },
      goal_pass: { type: DataTypes.INTEGER, allowNull: true },
      penalty: { type: DataTypes.INTEGER, allowNull: true },
      missed: { type: DataTypes.INTEGER, allowNull: true },
      time: { type: DataTypes.DOUBLE, allowNull: true }, // игровое время, сек.
      reliability_factor: { type: DataTypes.DOUBLE, allowNull: true },
      game_time_percent: { type: DataTypes.INTEGER, allowNull: true },
      is_started: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      tableName: 'player_statistic',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'idx_team', fields: ['team_id'] },
        { name: 'idx_player', fields: ['player_id'] },
        { name: 'idx_tournament', fields: ['tournament_id'] },
        { name: 'idx_season', fields: ['season_id'] },
        { name: 'idx_game', fields: ['game_id'] },
        { fields: ['goal'] },
        { fields: ['assist'] },
      ],
    }
  );

  PlayerStatistic.associate = (models) => {
    PlayerStatistic.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'team_id',
      constraints: false,
    });

    PlayerStatistic.belongsTo(models.Player, {
      as: 'player',
      foreignKey: 'player_id',
      constraints: false,
    });

    PlayerStatistic.belongsTo(models.Tournament, {
      as: 'tournament',
      foreignKey: 'tournament_id',
      constraints: false,
    });

    PlayerStatistic.belongsTo(models.Season, {
      as: 'season',
      foreignKey: 'season_id',
      constraints: false,
    });

    PlayerStatistic.belongsTo(models.Game, {
      as: 'game',
      foreignKey: 'game_id',
      constraints: false,
    });
  };

  return PlayerStatistic;
};
