'use strict';

module.exports = (sequelize, DataTypes) => {
  const BasicDocumentCategory = sequelize.define(
    'BasicDocumentCategory',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      parent_category_id: {
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
        defaultValue: DataTypes.NOW,
      },

      date_update: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'basic_document_category',
      timestamps: false,
      underscored: true,
      collate: 'utf8mb4_unicode_ci',
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'category_index', fields: ['parent_category_id'] },
      ],
    }
  );

  BasicDocumentCategory.associate = (models) => {
    BasicDocumentCategory.hasMany(models.BasicDocument, {
      as: 'documents',
      foreignKey: 'category_id',
      constraints: false,
    });
  };

  return BasicDocumentCategory;
};
