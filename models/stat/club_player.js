module.exports = (sequelize, DataTypes) => {
  const ClubPlayer = sequelize.define(
    'ClubPlayer',
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
      player_id: {
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
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      photo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      declared: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      undeclared: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'club_player',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'club_index', fields: ['club_id'] },
        { name: 'player_index', fields: ['player_id'] },
        { name: 'role_index', fields: ['role_id'] },
        { fields: ['photo_id'], unique: true },
      ],
    }
  );

  ClubPlayer.associate = (models) => {
    ClubPlayer.belongsTo(models.Club, {
      as: 'club',
      foreignKey: 'club_id',
      constraints: false,
    });

    ClubPlayer.belongsTo(models.Player, {
      as: 'player',
      foreignKey: 'player_id',
      constraints: false,
    });

    ClubPlayer.belongsTo(models.TeamPlayerRole, {
      as: 'role',
      foreignKey: 'role_id',
      constraints: false,
    });

    ClubPlayer.belongsTo(models.File, {
      as: 'photo',
      foreignKey: 'photo_id',
      constraints: false,
    });
  };

  return ClubPlayer;
};
