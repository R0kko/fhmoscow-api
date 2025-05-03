module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'StaffCategory',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      date_create: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      date_update: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'staff_category',
      timestamps: false,
      underscored: true,
      indexes: [{ name: 'objectStatus_index', fields: ['object_status'] }],
    }
  );
};
