module.exports = (sequelize, DataTypes) => {
  const RefereeCategory = sequelize.define(
    'RefereeCategory',
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
      tableName: 'referee_category',
      timestamps: false,
      underscored: true,
      collate: 'utf8mb4_unicode_ci',
    }
  );

  RefereeCategory.associate = (models) => {
    RefereeCategory.hasMany(models.Referee, {
      as: 'referees',
      foreignKey: 'category_id',
      constraints: false,
    });
  };

  return RefereeCategory;
};
