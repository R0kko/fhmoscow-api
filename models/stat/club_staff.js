module.exports = (sequelize, DataTypes) => {
  const ClubStaff = sequelize.define(
    'ClubStaff',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      club_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      staff_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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

      employment: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'club_staff',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'club_index', fields: ['club_id'] },
        { name: 'staff_index', fields: ['staff_id'] },
        { name: 'category_index', fields: ['category_id'] },
        { fields: ['photo_id'], unique: true },
      ],
    }
  );

  ClubStaff.associate = (models) => {
    ClubStaff.belongsTo(models.Club, {
      as: 'club',
      foreignKey: 'club_id',
      constraints: false,
    });

    ClubStaff.belongsTo(models.Staff, {
      as: 'staff',
      foreignKey: 'staff_id',
      constraints: false,
    });

    ClubStaff.belongsTo(models.File, {
      as: 'photo',
      foreignKey: 'photo_id',
      constraints: false,
    });

    ClubStaff.belongsTo(models.StaffCategory, {
      as: 'category',
      foreignKey: 'category_id',
      constraints: false,
    });
  };

  return ClubStaff;
};
