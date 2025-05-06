module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    'Game',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      date_create: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      date_update: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      date_start: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      tour_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      stadium_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      team1_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      team2_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      score_team1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      score_team2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      broadcast: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },

      number_viewers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      number_game: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      match_number_playoff: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      play_off_info: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      shootout_score_team1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      shootout_score_team2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      broadcast2: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },

      technical_defeat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      points_for_tournament_table_team1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      points_for_tournament_table_team2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      cancel_status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'game',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'tour_index', fields: ['tour_id'] },
        { name: 'stadium_index', fields: ['stadium_id'] },
        { name: 'team1_index', fields: ['team1_id'] },
        { name: 'team2_index', fields: ['team2_id'] },
      ],
    }
  );

  Game.associate = (models) => {
    Game.belongsTo(models.Tour, {
      as: 'tour',
      foreignKey: 'tour_id',
      constraints: false,
    });

    Game.belongsTo(models.Stadium, {
      as: 'stadium',
      foreignKey: 'stadium_id',
      constraints: false,
    });

    Game.belongsTo(models.Team, {
      as: 'team1',
      foreignKey: 'team1_id',
      constraints: false,
    });

    Game.belongsTo(models.Team, {
      as: 'team2',
      foreignKey: 'team2_id',
      constraints: false,
    });

    Game.hasMany(models.GameEvent, {
      as: 'events',
      foreignKey: 'game_id',
      constraints: false,
    });

    Game.hasMany(models.GamePlayer, {
      as: 'players',
      foreignKey: 'game_id',
      constraints: false,
    });

    Game.belongsToMany(models.Referee, {
      through: models.GameReferee,
      as: 'referees',
      foreignKey: 'game_id',
      otherKey: 'referee_id',
      constraints: false,
    });
  };

  return Game;
};
