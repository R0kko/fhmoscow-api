'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const [results] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM users'
    );
    const count = parseInt(results[0].count, 10);
    if (count === 0) {
      await queryInterface.bulkInsert('users', [
        {
          id: queryInterface.sequelize.literal('uuid_generate_v4()'),
          last_name: 'Иванов',
          first_name: 'Иван',
          middle_name: 'Иванович',
          date_of_birth: '1990-01-01',
          email: 'ivanov@example.com',
          phone: '79104055190',
          password: '$2b$10$dummyHashedPassword',
          created_by: null,
          updated_by: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
