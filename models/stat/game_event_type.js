module.exports = (sequelize, DataTypes) => {
  const GameEventType = sequelize.define(
    'GameEventType',
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
      tableName: 'game_event_type',
      timestamps: false,
      underscored: true,
    }
  );

  GameEventType.associate = () => {};

  return GameEventType;
};
