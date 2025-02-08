# 1) Выбираем базовый образ Node.js
FROM node:18-alpine AS builder

# 2) Создаем рабочую директорию в контейнере
WORKDIR /app

# 3) Копируем package.json и package-lock.json
COPY package*.json ./

# 4) Устанавливаем зависимости
RUN npm install

# 5) Копируем исходный код
COPY . .

# 6) Пробрасываем порт приложения (Express обычно слушает 3001)
EXPOSE 3001

# 7) Команда запуска
CMD ["npm", "run", "dev"]
