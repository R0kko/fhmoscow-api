const path = require('path');

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
   * @param {number|string} id         – ID файла (число или строка)
   * @param {string}        moduleName – camelCase модуль (например clubPlayerPhoto)
   * @param {string}        name       – оригинальное имя файла для определения расширения
   * @returns {string} URL к файлу на CDN
   */
  static url(id, moduleName, name = '') {
    const subPath = camelToPath(moduleName);

    let ext = path
      .extname(name || '')
      .toLowerCase()
      .replace(/^\./, '');
    if (ext === '') {
      ext = 'bin';
    }
    ext = `.${ext}`;

    return `${CDN_BASE}/${subPath}/${id}${ext}`;
  }
}

module.exports = FileService;
