module.exports = (sequelize, DataTypes) => {
  const GameEvent = sequelize.define(
    'GameEvent',
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

      event_type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      goal_author_id: DataTypes.INTEGER.UNSIGNED,
      goal_assistant1_id: DataTypes.INTEGER.UNSIGNED,
      goal_assistant2_id: DataTypes.INTEGER.UNSIGNED,
      goal_situation_id: DataTypes.INTEGER.UNSIGNED,
      shootout_player_id: DataTypes.INTEGER.UNSIGNED,
      penalty_player_id: DataTypes.INTEGER.UNSIGNED,
      penalty_violation_id: DataTypes.INTEGER.UNSIGNED,
      goalkeeper_team1_id: DataTypes.INTEGER.UNSIGNED,
      goalkeeper_team2_id: DataTypes.INTEGER.UNSIGNED,

      minute: DataTypes.INTEGER,
      second: DataTypes.INTEGER,
      period: DataTypes.INTEGER,

      goal_free_throw: DataTypes.BOOLEAN,
      shootout_realised: DataTypes.BOOLEAN,
      team_penalty: DataTypes.BOOLEAN,

      team_id: DataTypes.INTEGER.UNSIGNED,

      penalty_minutes_id: DataTypes.INTEGER.UNSIGNED,
      penalty_finish_minute: DataTypes.INTEGER,
      penalty_finish_second: DataTypes.INTEGER,
    },
    {
      tableName: 'game_event',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'game_index', fields: ['game_id'] },
        { name: 'eventType_index', fields: ['event_type_id'] },
        { name: 'team_index', fields: ['team_id'] },
        { name: 'goalSituation_index', fields: ['goal_situation_id'] },
        { name: 'penaltyViolation_index', fields: ['penalty_violation_id'] },
        { name: 'penaltyMinutes_index', fields: ['penalty_minutes_id'] },
        { name: 'goalAuthor_index', fields: ['goal_author_id'] },
        { name: 'goalAssist1_index', fields: ['goal_assistant1_id'] },
        { name: 'goalAssist2_index', fields: ['goal_assistant2_id'] },
        { name: 'goalkeeper1_index', fields: ['goalkeeper_team1_id'] },
        { name: 'goalkeeper2_index', fields: ['goalkeeper_team2_id'] },
        { name: 'shootoutPlayer_index', fields: ['shootout_player_id'] },
        {
          name: 'shootoutGoalkeeper_index',
          fields: ['shootout_goalkeeper_id'],
        },
      ],
    }
  );

  GameEvent.associate = (models) => {
    GameEvent.belongsTo(models.Game, {
      as: 'game',
      foreignKey: 'game_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.GameEventType, {
      as: 'eventType',
      foreignKey: 'event_type_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'team_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.GameSituation, {
      as: 'goalSituation',
      foreignKey: 'goal_situation_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.GameViolation, {
      as: 'penaltyViolation',
      foreignKey: 'penalty_violation_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.PenaltyMinutes, {
      as: 'penaltyMinutes',
      foreignKey: 'penalty_minutes_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'goalAuthor',
      foreignKey: 'goal_author_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'goalAssistant1',
      foreignKey: 'goal_assistant1_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'goalAssistant2',
      foreignKey: 'goal_assistant2_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'penaltyPlayer',
      foreignKey: 'penalty_player_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'shootoutPlayer',
      foreignKey: 'shootout_player_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'shootoutGoalkeeper',
      foreignKey: 'shootout_goalkeeper_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'goalkeeperTeam1',
      foreignKey: 'goalkeeper_team1_id',
      constraints: false,
    });

    GameEvent.belongsTo(models.Player, {
      as: 'goalkeeperTeam2',
      foreignKey: 'goalkeeper_team2_id',
      constraints: false,
    });
  };

  return GameEvent;
};
