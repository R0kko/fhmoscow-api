const path = require('path');

const statDb = require('../models/stat');

const CDN_BASE = process.env.CDN_BASE_URL;

/**
 * Преобразовать camelCase-модуль в путь через '/'.
 *  clubPlayerPhoto → club/player/photo
 */
function camelToPath(mod) {
  return mod
    .replace(/([a-z])([A-Z])/g, '$1/$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1/$2')
    .toLowerCase();
}

class FileService {
  /**
   * Сгенерировать прямую ссылку на файл.
   * @param {number} id          – ID файла
   * @param {string=} moduleName – camelCase модуль (если не указан, берём из поля path)
   * @returns {Promise<string>}  – URL
   */
  static async url(id, moduleName) {
    const file = await statDb.File.findByPk(id);
    if (!file) {
      throw new Error('Файл не найден');
    }

    // Определяем подпуть
    const subPath = camelToPath(moduleName ?? file.path ?? '');

    // Расширение берём из original_name, fallback по mime
    let ext = path.extname(file.original_name || '').toLowerCase();
    if (!ext) {
      ext = file.mime_type.split('/')[1] || 'bin';
      ext = `.${ext}`;
    }

    return `${CDN_BASE}/${subPath}/${id}${ext}`;
  }
}

module.exports = FileService;
