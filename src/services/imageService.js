const prisma = require('../config/prisma');
const yandexDiskService = require('./yandexDiskService');

class ImageService {
  /**
   * Возвращает случайное изображение (Base64), для которого пользователь ещё
   * не делал попытку угадывания (по таблице Guesses).
   */
  async getRandomImageForUser(userId) {
    // 1) получаем список ID изображений, по которым у пользователя НЕТ guess
    // 2) выбираем одно случайное
    const images = await prisma.$queryRaw`
      SELECT "Image".id, "Image"."imgPreview"
      FROM "Image"
      LEFT JOIN "Guess" ON "Guess"."imageId" = "Image".id AND "Guess"."userId" = ${userId}
      WHERE "Guess".id IS NULL
    `;

    if (!images || images.length === 0) {
      return null; // нет новых изображений
    }

    // случайно выбираем одно
    const randomIndex = Math.floor(Math.random() * images.length);
    const { id, imgPreview } = images[randomIndex];

    // запрашиваем бинарные данные через YandexDiskService
    const buffer = await yandexDiskService.getImageAsync(imgPreview);
    console.log('Размер бинарных данных:', buffer.length, 'байт');

    // превращаем в base64
    const base64Data = buffer.toString('base64');
    return {
      imageId: id,
      base64: base64Data,
    };
  }
}

module.exports = new ImageService();
