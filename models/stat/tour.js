module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define(
    'Tour',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      tournament_group_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      date_start: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      date_end: {
        type: DataTypes.DATE,
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

      tournament_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'tour',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'group_index', fields: ['tournament_group_id'] },
        { name: 'tournament_index', fields: ['tournament_id'] },
      ],
    }
  );

  Tour.associate = (models) => {
    Tour.belongsTo(models.Group, {
      as: 'group',
      foreignKey: 'tournament_group_id',
      constraints: false,
    });

    Tour.belongsTo(models.Tournament, {
      as: 'tournament',
      foreignKey: 'tournament_id',
      constraints: false,
    });

    Tour.hasMany(models.Game, {
      as: 'games',
      foreignKey: 'tour_id',
      constraints: false,
    });
  };

  return Tour;
};
