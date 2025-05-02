module.exports = (sequelize, DataTypes) => {
  const Stage = sequelize.define(
    'Stage',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      tournament_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
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
      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      play_off: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      current: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      transition: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      play_off_bracket: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'stage',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['tournament_id'] },
        { name: 'objectStatus_index', fields: ['object_status'] },
      ],
    }
  );

  Stage.associate = (models) => {
    Stage.belongsTo(models.Tournament, {
      as: 'tournament',
      foreignKey: 'tournament_id',
    });
  };

  return Stage;
};
