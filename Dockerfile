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

# 6) Генерируем Prisma Client, чтобы он был доступен для рантайма
RUN npx prisma generate

# 7) Открываем порт (если нужно), например 3001
EXPOSE 3001

# 8) 
# Запускаем команду, которая:
#  - сначала применяет миграции (migrate deploy),
#  - затем стартует приложение.
# 
# Можно вместо "npm run start" использовать "npm run dev", если нужно.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]