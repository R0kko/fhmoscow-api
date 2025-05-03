module.exports = (sequelize, DataTypes) => {
  const TeamStaff = sequelize.define(
    'TeamStaff',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      staff_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      team_id: {
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

      contract_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'team_staff',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'staff_index', fields: ['staff_id'] },
        { name: 'team_index', fields: ['team_id'] },
        { name: 'contract_index', fields: ['contract_id'] },
      ],
    }
  );

  // Associations
  TeamStaff.associate = (models) => {
    TeamStaff.belongsTo(models.Staff, {
      as: 'staff',
      foreignKey: 'staff_id',
      constraints: false,
    });

    TeamStaff.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'team_id',
      constraints: false,
    });

    // "club_staff" таблица с контрактами сотрудников клуба
    // предполагаем, что модель названа ClubStaff
    TeamStaff.belongsTo(models.ClubStaff, {
      as: 'contract',
      foreignKey: 'contract_id',
      constraints: false,
    });
  };

  return TeamStaff;
};
