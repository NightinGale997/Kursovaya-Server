const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/auth');
const imageService = require('../services/imageService');

/**
 * GET /images/random
 * Возвращает случайное изображение (base64) для текущего юзера
 */
router.get('/random', firebaseAuth, async (req, res) => {
  try {
    const { userId } = req;
    const imageData = await imageService.getRandomImageForUser(userId);
    if (!imageData) {
      return res.status(404).json({ message: 'Нет новых изображений' });
    }
    return res.json(imageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении случайного изображения' });
  }
});

/**
 * POST /images/sync
 * Запускает процесс обновления картинок с Яндекс.Диска вручную.
 */
router.post('/sync', firebaseAuth, async (req, res) => {
  try {
    await yandexDiskService.updateImagesAsync();
    return res.json({ message: 'Синхронизация с Яндекс.Диском завершена' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка при синхронизации' });
  }
});

module.exports = router;
