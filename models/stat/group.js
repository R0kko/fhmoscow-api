module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      tournament_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      stage_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
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
    },
    {
      tableName: 'group',
      timestamps: false,
      underscored: true,
      indexes: [
        { fields: ['stage_id'] },
        { fields: ['tournament_id'] },
        { name: 'objectStatus_index', fields: ['object_status'] },
      ],
    }
  );

  Group.associate = (models) => {
    Group.belongsTo(models.Tournament, {
      foreignKey: 'tournament_id',
      as: 'tournament',
    });

    Group.belongsTo(models.Stage, {
      foreignKey: 'stage_id',
      as: 'stage',
    });
  };

  return Group;
};
