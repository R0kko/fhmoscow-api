module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      site: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      stadium_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tags_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'team',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'club_index', fields: ['club_id'] },
        { name: 'IDX_team_stadium', fields: ['stadium_id'] },
        { fields: ['tags_id'], unique: true },
        { fields: ['logo_id'], unique: true },
      ],
    }
  );

  Team.associate = (models) => {
    Team.belongsTo(models.Club, {
      as: 'club',
      foreignKey: 'club_id',
      constraints: false,
    });

    Team.belongsTo(models.File, {
      as: 'logo',
      foreignKey: 'logo_id',
      constraints: false,
    });

    Team.belongsTo(models.Stadium, {
      as: 'stadium',
      foreignKey: 'stadium_id',
      constraints: false,
    });

    Team.belongsToMany(models.Player, {
      through: models.TeamPlayer,
      as: 'players',
      foreignKey: 'team_id',
      otherKey: 'player_id',
      constraints: false,
    });

    Team.hasMany(models.TeamPlayer, {
      as: 'playerLinks',
      foreignKey: 'team_id',
      constraints: false,
    });

    Team.hasMany(models.TeamStaff, {
      as: 'teamStaff',
      foreignKey: 'team_id',
      constraints: false,
    });
  };

  return Team;
};
