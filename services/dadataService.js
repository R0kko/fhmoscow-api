const axios = require('axios');

const logger = require('../utils/logger');

const DADATA_TOKEN = process.env.DADATA_API_KEY;
const DADATA_SECRET = process.env.DADATA_SECRET_KEY;
const DADATA_URL = 'https://cleaner.dadata.ru/api/v1/clean/name';

if (!DADATA_TOKEN || !DADATA_SECRET) {
  logger.warn(
    'DADATA_API_KEY / DADATA_SECRET_KEY не заданы – NameService будет недоступен'
  );
}

class DadataService {
  /**
   * Отправляет одно ФИО в DaData и возвращает стандартизованный объект
   * @param {string} rawName – «Срегей владимерович иванов»
   * @returns {Promise<object>} – объект DaData (surname, name, patronymic, gender, qc…)
   */
  static async cleanName(rawName) {
    if (!DADATA_TOKEN || !DADATA_SECRET) {
      throw new Error('DaData creds missing');
    }

    const { data } = await axios.post(DADATA_URL, [rawName], {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${DADATA_TOKEN}`,
        'X-Secret': DADATA_SECRET,
      },
      timeout: 5000,
    });
    return data[0];
  }
}

module.exports = DadataService;
