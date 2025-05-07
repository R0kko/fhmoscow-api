module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define(
    'Player',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      grip: DataTypes.STRING,
      height: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      repeated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reason_for_refusal: DataTypes.STRING,
      surname: DataTypes.STRING,
      name: DataTypes.STRING,
      patronymic: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      email: {
        type: DataTypes.STRING,
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
    },
    {
      tableName: 'player',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['sex_id'] },
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'uniq_photo', unique: true, fields: ['photo_id'] },
      ],
    }
  );

  Player.associate = (models) => {
    Player.belongsTo(models.Sex, {
      foreignKey: 'sex_id',
      as: 'sex',
    });

    Player.belongsTo(models.File, {
      foreignKey: 'photo_id',
      as: 'photo',
    });

    Player.belongsToMany(models.Team, {
      through: models.TeamPlayer,
      as: 'teams',
      foreignKey: 'player_id',
      otherKey: 'team_id',
      constraints: false,
    });

    Player.hasMany(models.TeamPlayer, {
      as: 'teamLinks',
      foreignKey: 'player_id',
      constraints: false,
    });
  };

  return Player;
};
