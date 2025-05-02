module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define(
    'City',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      country_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'city',
      timestamps: false,
      underscored: true,
      indexes: [{ name: 'IDX_city_country', fields: ['country_id'] }],
    }
  );

  City.associate = (models) => {
    City.belongsTo(models.Country, {
      as: 'country',
      foreignKey: 'country_id',
      constraints: false,
    });
  };

  return City;
};
