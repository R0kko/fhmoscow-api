module.exports = (sequelize, DataTypes) => {
  const Referee = sequelize.define(
    'Referee',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      date_create: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      date_update: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true },
      },

      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
      },

      employment: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      reason_for_refusal: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      patronymic: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      /* FK → file.id */
      photo_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      /* FK → sex.id */
      sex_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'referee',
      timestamps: false,
      underscored: true,

      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'category_index', fields: ['category_id'] },
        { name: 'IDX_referee_sex', fields: ['sex_id'] },
        { fields: ['photo_id'], unique: true },
      ],
    }
  );

  // ---------------------------------------------------------------------------
  // Associations
  // ---------------------------------------------------------------------------
  Referee.associate = (models) => {
    Referee.belongsTo(models.RefereeCategory, {
      as: 'category',
      foreignKey: 'category_id',
      constraints: false,
    });

    Referee.belongsTo(models.File, {
      as: 'photo',
      foreignKey: 'photo_id',
      constraints: false,
    });

    Referee.belongsTo(models.Sex, {
      as: 'sex',
      foreignKey: 'sex_id',
      constraints: false,
    });
  };

  return Referee;
};
