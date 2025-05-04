module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'PenaltyMinutes',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      minutes: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'penalty_minutes',
      timestamps: false,
      underscored: true,
    }
  );
};
