module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'PlayerPosition',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'player_position',
      timestamps: false,
      underscored: true,
      indexes: [
        { name: 'IDX_player_position_name', fields: ['name'] },
        { name: 'abbreviation_index', fields: ['abbreviation'] },
      ],
    }
  );
};
