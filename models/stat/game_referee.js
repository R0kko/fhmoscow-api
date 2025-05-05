module.exports = (sequelize, DataTypes) => {
  const GameReferee = sequelize.define(
    'GameReferee',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      referee_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'game_referee',
      timestamps: false,
      underscored: true,
      collate: 'utf8mb4_unicode_ci',
      indexes: [
        { name: 'IDX_game_referee_referee', fields: ['referee_id'] },
        { name: 'IDX_game_referee_game', fields: ['game_id'] },
      ],
    }
  );

  GameReferee.associate = (models) => {
    GameReferee.belongsTo(models.Referee, {
      as: 'referee',
      foreignKey: 'referee_id',
      constraints: false,
    });

    GameReferee.belongsTo(models.Game, {
      as: 'game',
      foreignKey: 'game_id',
      constraints: false,
    });
  };

  return GameReferee;
};
