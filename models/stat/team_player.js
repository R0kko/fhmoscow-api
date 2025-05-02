module.exports = (sequelize, DataTypes) => {
  const TeamPlayer = sequelize.define(
    'TeamPlayer',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      player_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      object_status: {
        type: DataTypes.STRING,
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
      team_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      contract_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'team_player',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'player_index', fields: ['player_id'] },
        { name: 'team_index', fields: ['team_id'] },
        { name: 'IDX_team_player_contract', fields: ['contract_id'] },
      ],
    }
  );

  TeamPlayer.associate = (models) => {
    TeamPlayer.belongsTo(models.Player, {
      as: 'player',
      foreignKey: 'player_id',
      constraints: false,
    });

    TeamPlayer.belongsTo(models.Team, {
      as: 'team',
      foreignKey: 'team_id',
      constraints: false,
    });

    TeamPlayer.belongsTo(models.ClubPlayer, {
      as: 'contract',
      foreignKey: 'contract_id',
      constraints: false,
    });
  };

  return TeamPlayer;
};
