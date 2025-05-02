module.exports = (sequelize, DataTypes) => {
  const Stadium = sequelize.define(
    'Stadium',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      city_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      create_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'stadium',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'stadium_object_status_index', fields: ['object_status'] },
        { name: 'IDX_stadium_city', fields: ['city_id'] },
        { fields: ['image_id'], unique: true },
      ],
    }
  );

  Stadium.associate = (models) => {
    Stadium.belongsTo(models.City, {
      as: 'city',
      foreignKey: 'city_id',
      constraints: false,
    });

    Stadium.belongsTo(models.File, {
      as: 'image',
      foreignKey: 'image_id',
      constraints: false,
    });
  };

  return Stadium;
};
