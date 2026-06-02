const schedule = require('node-schedule');
const scrapingService = require('./scraping-service');

class SchedulingService {
  constructor() {
    this.jobs = {};
  }

  scheduleDaily(modelName, url, Model, timeHour = 22, timeMinute = 3) {
    const cronExpression = `${timeMinute} ${timeHour} * * *`;
    
    const job = schedule.scheduleJob(cronExpression, async () => {
      console.log(`[${modelName}] Executando scraping agendado...`);
      await scrapingService.scrapeUrl(url, Model, modelName);
    });

    this.jobs[modelName] = job;
    console.log(`[${modelName}] Scraping agendado para todos os dias às ${timeHour}:${String(timeMinute).padStart(2, '0')}`);
  }

  cancelJob(modelName) {
    if (this.jobs[modelName]) {
      this.jobs[modelName].cancel();
      delete this.jobs[modelName];
      console.log(`[${modelName}] Agendamento cancelado`);
    }
  }

  getAllJobs() {
    return Object.keys(this.jobs);
  }
}

module.exports = new SchedulingService();
