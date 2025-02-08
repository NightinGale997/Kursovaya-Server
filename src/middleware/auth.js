const admin = require('../config/firebase');

/**
 * Проверка Bearer-токена, выданного Firebase.
 * В заголовке запроса должен быть:
 *    Authorization: Bearer <token>
 */
async function firebaseAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json({ error: 'Требуется токен Firebase' });
  }

  const token = match[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // записываем uid в req.userId
    req.userId = decodedToken.uid;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
}

module.exports = firebaseAuthMiddleware;
