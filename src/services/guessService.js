const prisma = require('../config/prisma');

class GuessService {
  /**
   * Сохраняет ответ пользователя (букву или «Не удалось распознать»).
   */
  async submitGuess(userId, imageId, guessedLetter) {
    await prisma.guess.create({
      data: {
        userId,
        imageId,
        guessedLetter,
      },
    });
  }
}

module.exports = new GuessService();
