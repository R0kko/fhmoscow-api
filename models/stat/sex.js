module.exports = (sequelize, DataTypes) => {
  const Sex = sequelize.define(
    'Sex',
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
      tableName: 'sex',
      timestamps: false,
      underscored: true,
    }
  );

  return Sex;
};
