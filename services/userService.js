const bcrypt = require('bcryptjs');

const { User, Role } = require('../models/main');

class UserService {
  static async getById(id) {
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
      include: [
        {
          model: Role,
          attributes: ['name', 'alias'],
          through: { attributes: [] },
        },
      ],
    });
    if (!user) {
      return null;
    }
    const plain = user.get();
    plain.roles =
      plain.Roles?.map((r) => ({ name: r.name, alias: r.alias })) || [];
    delete plain.Roles;
    return plain;
  }

  static async updateProfile(id, payload) {
    const allowed = ['email'];

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
      include: [
        {
          model: Role,
          attributes: ['name', 'alias'],
          through: { attributes: [] },
        },
      ],
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
    plain.roles =
      plain.Roles?.map((r) => ({ name: r.name, alias: r.alias })) || [];
    delete plain.Roles;
    return plain;
  }

  static async updatePassword(id, oldPassword, newPassword) {
    const user = await User.unscoped().findByPk(id, {
      attributes: ['id', 'password'],
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
