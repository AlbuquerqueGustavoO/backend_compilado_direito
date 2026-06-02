const puppeteer = require('puppeteer');

class ScrapingService {
  constructor() {
    this.browserInstance = null;
  }

  async scrapeUrl(url, Model, modelName) {
    try {
      console.log(`[${modelName}] Iniciando scraping de: ${url}`);
      
      if (!this.browserInstance) {
        this.browserInstance = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }

      const page = await this.browserInstance.newPage();
      await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });
      
      const bodyText = await page.evaluate(() => document.body.innerText);
      await page.close();

      console.log(`[${modelName}] Conteúdo extraído com sucesso`);

      const now = new Date();
      const data = {
        conteudo: bodyText,
        referencia: url,
        ultimoScraping: now
      };

      const [registro, criado] = await Model.findOrCreate({
        where: { id: 1 },
        defaults: data
      });

      if (!criado) {
        registro.conteudo = bodyText;
        registro.referencia = url;
        registro.ultimoScraping = now;
        await registro.save();
      }

      console.log(`[${modelName}] Scraping concluído com sucesso!`);
      return { success: true, timestamp: now, url };
    } catch (error) {
      console.error(`[${modelName}] Erro durante o scraping:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async closeBrowser() {
    if (this.browserInstance) {
      await this.browserInstance.close();
      this.browserInstance = null;
    }
  }
}

module.exports = new ScrapingService();
