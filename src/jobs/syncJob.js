// src/jobs/syncJob.js
const cron = require('node-cron');
const yandexDiskService = require('../services/yandexDiskService');

/**
 * Запускаем cron задачу, которая каждый час вызывает updateImagesAsync()
 * Паттерн cron "0 * * * *" = каждые 0 минут каждого часа
 */
function startSyncJob() {
  cron.schedule('0 * * * *', async () => {
    console.log('Запуск синхронизации с Яндекс.Диском');
    await yandexDiskService.updateImagesAsync();
    console.log('Синхронизация завершена');
  });
}

module.exports = { startSyncJob };
