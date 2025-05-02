module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'TeamPlayerRole',
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
      tableName: 'team_player_role',
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ['name'] }, { fields: ['abbreviation'] }],
    }
  );
};
