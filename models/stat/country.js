module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Country',
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
      tableName: 'country',
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ['name'] }],
    }
  );
};
