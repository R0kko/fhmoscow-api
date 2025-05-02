module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define(
    'Tournament',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      season_id: {
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
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      year_of_birth: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tags_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      hide_in_main_calendar: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      tableName: 'tournament',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'IDX_tournament_season', fields: ['season_id'] },
        { name: 'IDX_tournament_type', fields: ['type_id'] },
        { name: 'objectStatus_index', fields: ['object_status'] },
        { fields: ['tags_id'], unique: true },
        { fields: ['logo_id'], unique: true },
      ],
    }
  );

  Tournament.associate = (models) => {
    Tournament.belongsTo(models.TournamentType, {
      as: 'type',
      foreignKey: 'type_id',
      constraints: false,
    });

    Tournament.belongsTo(models.Season, {
      as: 'season',
      foreignKey: 'season_id',
      constraints: false,
    });

    Tournament.belongsTo(models.File, {
      as: 'logo',
      foreignKey: 'logo_id',
      constraints: false,
    });

    Tournament.hasMany(models.Stage, {
      as: 'stages',
      foreignKey: 'tournament_id',
      constraints: false,
    });
  };

  return Tournament;
};
