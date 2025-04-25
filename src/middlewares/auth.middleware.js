// В файле: middlewares/auth.middleware.js

import jwt from 'jsonwebtoken';
// Рекомендуется использовать http-errors для единообразия ошибок
import createHttpError from 'http-errors';

const auth = (req, res, next) => {
  // 1. Получаем заголовок Authorization
  const authHeader = req.headers.authorization;

  // Проверяем наличие заголовка
  if (!authHeader) {
    // Передаем ошибку через next() стандартным образом
    return next(createHttpError(401, 'Authorization header missing'));
    // Старый вариант: return res.status(401).json({ message: 'No token provided' });
  }

  // 2. Разделяем заголовок на "Bearer" и сам токен
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Authorization header format must be Bearer <token>'));
  }

  try {
    // 3. Верифицируем токен с ПРАВИЛЬНЫМ секретом из .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Достаем ID пользователя из расшифрованного токена
    //    (Убедитесь, что при создании токена вы клали туда поле 'userId')
    const userId = decoded.userId;

    // 5. Проверяем, что userId есть в токене
    if (!userId) {
       return next(createHttpError(401, 'Token is valid but missing user ID'));
    }

    // 6. Прикрепляем ТОЛЬКО userId к объекту запроса
    req.userId = userId;

    // 7. Передаем управление следующему middleware или контроллеру
    next();

  } catch (err) {
    // Обрабатываем ошибки верификации токена (невалидный, истек срок и т.д.)
    if (err instanceof jwt.JsonWebTokenError) {
       // Ошибка связана с самим JWT (неверная подпись, истек срок и т.д.)
       return next(createHttpError(401, 'Invalid or expired token'));
    }
    // Другие возможные ошибки при верификации
    console.error("Token verification error:", err); // Логируем для отладки
    return next(createHttpError(500, 'Internal error during token verification'));
    // Старый вариант: res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;