const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/auth');
const guessService = require('../services/guessService');

/**
 * POST /guesses
 * { imageId, letter }
 */
router.post('/', firebaseAuth, async (req, res) => {
  try {
    const { userId } = req;
    const { imageId, letter } = req.body;
    if (!imageId || !letter) {
      return res.status(400).json({ error: 'Необходимо указать imageId и letter' });
    }

    await guessService.submitGuess(userId, imageId, letter);
    return res.status(200).json({ message: 'Угадывание сохранено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при сохранении угадывания' });
  }
});

/**
 * GET /guesses/all
 * Возвращает полный список записей из таблицы Guesses
 */
router.get('/all', firebaseAuth, async (req, res) => {
  try {
    const allGuesses = await prisma.guess.findMany({
      // Можно подгрузить связанные данные (User, Image),
      // если нужно, через include:
      // include: { user: true, image: true }
    });
    return res.json(allGuesses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка при получении guesses' });
  }
});

module.exports = router;
