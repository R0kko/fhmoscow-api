module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    'Staff',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      reason_for_refusal: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      surname: DataTypes.STRING,
      name: DataTypes.STRING,
      patronymic: DataTypes.STRING,

      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
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

      photo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      sex_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'staff',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { fields: ['sex_id'] },
        { fields: ['photo_id'], unique: true },
      ],
    }
  );

  // Associations
  Staff.associate = (models) => {
    Staff.belongsTo(models.Sex, {
      as: 'sex',
      foreignKey: 'sex_id',
      constraints: false,
    });

    Staff.belongsTo(models.File, {
      as: 'photo',
      foreignKey: 'photo_id',
      constraints: false,
    });
  };

  return Staff;
};
