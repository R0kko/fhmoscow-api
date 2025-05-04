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

  // Нет прямых связей, к нему ссылаются другие модели (GameEvent)
  GameEventType.associate = () => {};

  return GameEventType;
};
