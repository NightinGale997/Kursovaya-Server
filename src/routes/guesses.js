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

module.exports = router;
