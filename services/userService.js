const bcrypt = require('bcryptjs');

const { User } = require('../models');

class UserService {
  static async getById(id) {
    return User.findByPk(id, {
      attributes: {
        exclude: [
          'password',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'created_by',
          'updated_by',
        ],
      },
    });
  }

  static async updateProfile(id, payload) {
    const allowed = ['first_name', 'last_name', 'middle_name', 'date_of_birth'];

    const user = await User.findByPk(id, {
      attributes: {
        exclude: [
          'password',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'created_by',
          'updated_by',
        ],
      },
    });
    if (!user) {
      return null;
    }

    allowed.forEach((key) => {
      if (payload[key] !== undefined) {
        user[key] = payload[key];
      }
    });

    await user.save();
    const plain = user.get();
    delete plain.password;
    return plain;
  }

  static async updatePassword(id, oldPassword, newPassword) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'created_by',
          'updated_by',
        ],
      },
    });
    if (!user) {
      return { ok: false, reason: 'not_found' };
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return { ok: false, reason: 'wrong_password' };
    }

    user.password = await bcrypt.hash(newPassword, 15);
    await user.save();

    return { ok: true };
  }
}

module.exports = UserService;
