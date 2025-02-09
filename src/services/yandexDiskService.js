const axios = require('axios');
const prisma = require('../config/prisma');
const dotenv = require('dotenv');
dotenv.config();

const YANDEX_API_ENDPOINT = 'https://cloud-api.yandex.net/v1/disk/resources';

class YandexDiskService {
  constructor() {
    this.token = process.env.YANDEX_OAUTH_TOKEN;
  }

  /**
   * Обновляет список изображений в БД, добавляя новые (если их нет).
   */
  async updateImagesAsync() {
    try {
      const datasetPath = 'dataset';
      const limit = 100;        // Сколько записей берем за один запрос
      let offset = 0;          // Смещение в списке
      let hasMore = true;      // Флаг, что есть ещё страницы

      while (hasMore) {
        // Формируем URL c limit и offset
        const url = `${YANDEX_API_ENDPOINT}?path=${datasetPath}&limit=${limit}&offset=${offset}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `OAuth ${this.token}`,
          },
        });

        // Извлекаем массив с элементами
        const items = response.data?._embedded?.items || [];

        // Если items пуст, значит достигли конца
        if (items.length === 0) {
          hasMore = false;
          break;
        }

        // Обрабатываем каждый item
        for (const item of items) {
          // item.name = 'abc.jpg' -> 'abc'
          const name = item.name.split('.')[0];

          const existing = await prisma.image.findUnique({
            where: { id: name },
          });

          if (!existing) {
            // Предположим, берем preview из поля preview
            const previewUrl = item.preview || '';

            await prisma.image.create({
              data: {
                id: name,
                imgPreview: previewUrl,
              },
            });
          }
        }

        // Увеличиваем offset на число полученных элементов
        offset += items.length;

        // Если вернулось меньше, чем limit — значит, дальше ничего нет
        if (items.length < limit) {
          hasMore = false;
        }
      }

      console.log('Синхронизация с Яндекс.Диском завершена');
    } catch (error) {
      console.error('Ошибка при обновлении изображений с Яндекс.Диска:', error);
    }
  }

  /**
   * Возвращает бинарные данные превью-изображения
   */
  async getImageAsync(previewUrl) {
    try {
      const response = await axios.get(previewUrl, {
        headers: {
          Authorization: `OAuth ${this.token}`,
        },
        responseType: 'arraybuffer',
      });
      return response.data; // бинарные данные
    } catch (error) {
      console.error('Ошибка при получении изображения:', error);
      throw error;
    }
  }
}

module.exports = new YandexDiskService();
