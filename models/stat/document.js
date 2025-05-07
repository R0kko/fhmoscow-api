'use strict';

module.exports = (sequelize, DataTypes) => {
  const BasicDocument = sequelize.define(
    'BasicDocument',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      file_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING,
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

      object_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      season_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      tournament_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },

      rang: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'basic_document',
      timestamps: false,
      underscored: true,
      collate: 'utf8mb4_unicode_ci',
      indexes: [
        { name: 'objectStatus_index', fields: ['object_status'] },
        { name: 'category_index', fields: ['category_id'] },
        { name: 'IDX_basic_document_season', fields: ['season_id'] },
        { name: 'IDX_basic_document_tournament', fields: ['tournament_id'] },
        { name: 'UNIQ_basic_document_file', unique: true, fields: ['file_id'] },
      ],
    }
  );

  BasicDocument.associate = (models) => {
    BasicDocument.belongsTo(models.BasicDocumentCategory, {
      as: 'category',
      foreignKey: 'category_id',
      constraints: false,
    });

    BasicDocument.belongsTo(models.Season, {
      as: 'season',
      foreignKey: 'season_id',
      constraints: false,
    });

    BasicDocument.belongsTo(models.Tournament, {
      as: 'tournament',
      foreignKey: 'tournament_id',
      constraints: false,
    });

    BasicDocument.belongsTo(models.File, {
      as: 'file',
      foreignKey: 'file_id',
      constraints: false,
    });
  };

  return BasicDocument;
};
