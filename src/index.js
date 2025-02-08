require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startSyncJob } = require('./jobs/syncJob');

const imagesRouter = require('./routes/images');
const guessesRouter = require('./routes/guesses');
const yandexDiskService = require('./services/yandexDiskService');

yandexDiskService.updateImagesAsync().then(() => console.log('обновление изображений при старте приложения завершено'));

const app = express();
app.use(cors());
app.use(express.json());

// Роуты
app.use('/images', imagesRouter);
app.use('/guesses', guessesRouter);

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// Запускаем фоновой cron
startSyncJob();
