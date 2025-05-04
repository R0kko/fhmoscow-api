module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'GameViolation',
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

      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'game_violation',
      timestamps: false,
      underscored: true,
    }
  );
};
