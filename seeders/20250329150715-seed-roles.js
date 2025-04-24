'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const [results] = await queryInterface.sequelize.query('SELECT COUNT(*) as count FROM roles');
    const count = parseInt(results[0].count, 10);
    if (count === 0) {
      await queryInterface.bulkInsert('roles', [
        {
          id: queryInterface.sequelize.literal('uuid_generate_v4()'),
          name: 'Администратор',
          alias: 'ADMIN',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: queryInterface.sequelize.literal('uuid_generate_v4()'),
          name: 'Пользователь',
          alias: 'USER',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: queryInterface.sequelize.literal('uuid_generate_v4()'),
          name: 'Судья',
          alias: 'REFEREE',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  },
};