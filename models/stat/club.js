module.exports = (sequelize, DataTypes) => {
  const Club = sequelize.define(
    'Club',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      date_create: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_update: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      short_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },
      site: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
      },
      logo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      tags_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      is_moscow: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rang: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'club',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { fields: ['tags_id'], unique: true },
        { fields: ['logo_id'], unique: true },
      ],
    }
  );

  Club.associate = (models) => {
    Club.belongsTo(models.File, {
      as: 'logo',
      foreignKey: 'logo_id',
      constraints: false,
    });
    // One‑to‑many: club → teams
    Club.hasMany(models.Team, {
      as: 'teams',
      foreignKey: 'club_id',
      constraints: false,
    });
  };

  return Club;
};
