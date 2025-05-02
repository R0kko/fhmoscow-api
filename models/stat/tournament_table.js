module.exports = (sequelize, DataTypes) => {
  const TournamentTable = sequelize.define(
    'TournamentTable',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      season_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      tournament_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      tournament_group_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      game_count: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      win_count: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      win_overtime_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      tie_count: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      loss_count: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      lose_overtime_count: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      pucks_scored: { type: DataTypes.INTEGER, allowNull: false },
      pucks_missed: { type: DataTypes.INTEGER, allowNull: false },
      pucks_difference: { type: DataTypes.DOUBLE, allowNull: false },

      score: { type: DataTypes.INTEGER, allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false },

      moscow_standings: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'tournament_table',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['season_id'] },
        { fields: ['tournament_id'] },
        { fields: ['tournament_group_id'] },
        { fields: ['team_id'] },
      ],
    }
  );

  /** Associations */
  TournamentTable.associate = (models) => {
    TournamentTable.belongsTo(models.Season, {
      foreignKey: 'season_id',
      as: 'season',
    });

    TournamentTable.belongsTo(models.Tournament, {
      foreignKey: 'tournament_id',
      as: 'tournament',
    });

    TournamentTable.belongsTo(models.Group, {
      foreignKey: 'tournament_group_id',
      as: 'group',
    });

    TournamentTable.belongsTo(models.Team, {
      foreignKey: 'team_id',
      as: 'team',
    });
  };

  return TournamentTable;
};
