module.exports = (sequelize, DataTypes) => {
  const GameSituation = sequelize.define(
    'GameSituation',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'game_situation',
      timestamps: false,
      underscored: true,
    }
  );

  GameSituation.associate = () => {};

  return GameSituation;
};
