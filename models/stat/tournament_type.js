module.exports = (sequelize, DataTypes) => {
  const TournamentType = sequelize.define(
    'TournamentType',
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
        allowNull: false,
      },
      short_name: {
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
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
      },
      double_protocol: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tags_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'tournament_type',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { fields: ['tags_id'], unique: true },
        { fields: ['logo_id'], unique: true },
      ],
    }
  );

  TournamentType.associate = (models) => {
    TournamentType.belongsTo(models.File, {
      as: 'logo',
      foreignKey: 'logo_id',
      constraints: false,
    });
  };

  return TournamentType;
};
