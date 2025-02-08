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
      const datasetPath = 'dataset'; // в дизайне path=dataset
      const url = `${YANDEX_API_ENDPOINT}?path=${datasetPath}&limit=1000`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `OAuth ${this.token}`,
        },
      });

      const items = response.data._embedded.items || [];
      for (const item of items) {
        // допустим, item.name = 'abc.jpg'
        const name = item.name.split('.')[0]; // отрезаем расширение

        // проверяем, есть ли уже такое изображение в БД
        const existing = await prisma.image.findUnique({
          where: { id: name },
        });
        if (!existing) {
          // предположим, что для превью используем preview URL:
          // item.preview или item.<что-то>
          // Но в Яндекс.Диске есть отдельный массив preview
          // Для примера возьмём item.preview по аналогии:
          const previewUrl = item.preview || ''; 

          await prisma.image.create({
            data: {
              id: name,
              imgPreview: previewUrl,
            },
          });
        }
      }
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
