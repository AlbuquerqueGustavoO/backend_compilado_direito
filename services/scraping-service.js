const puppeteer = require('puppeteer');
const ScrapingError = require('../models/scraping-error');

class ScrapingService {
  constructor() {
    this.browserInstance = null;
  }

  async scrapeUrl(url, Model, modelName) {
    let page;

    try {
      console.log(`[${modelName}] Iniciando scraping de: ${url}`);
      
      if (!this.browserInstance) {
        this.browserInstance = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      }

      page = await this.browserInstance.newPage();
      await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });
      
      const bodyText = await page.evaluate(() => document.body.innerText);

      if (!this.isValidScrapedContent(bodyText)) {
        const errorMessage = 'Conteúdo inválido ou não encontrado no corpo da página.';
        await this.recordError(modelName, url, errorMessage, bodyText);
        console.error(`[${modelName}] ${errorMessage}`);
        return { success: false, error: errorMessage };
      }

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
      const errorMessage = error.message || 'Erro desconhecido durante o scraping.';
      await this.recordError(modelName, url, errorMessage);
      console.error(`[${modelName}] Erro durante o scraping:`, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          console.warn(`[${modelName}] Falha ao fechar a página:`, closeError.message);
        }
      }
    }
  }

  isValidScrapedContent(bodyText) {
    if (!bodyText || typeof bodyText !== 'string') {
      return false;
    }

    const normalizedText = bodyText.trim();
    if (normalizedText.length < 200) {
      return false;
    }

    const lowerBody = normalizedText.toLowerCase();
    const invalidPhrases = [
      'ocorreu um erro! o conteúdo não foi encontrado',
      'conteúdo não foi encontrado',
      'página não encontrada'
    ];

    return !invalidPhrases.some(phrase => lowerBody.includes(phrase));
  }

  async recordError(routeName, url, errorMessage, details = null) {
    try {
      const detailsText = typeof details === 'string' ? details.slice(0, 2000) : null;
      await ScrapingError.create({
        routeName,
        url,
        errorMessage,
        details: detailsText,
        occurredAt: new Date()
      });
    } catch (recordError) {
      console.error(`[${routeName}] Não foi possível gravar o erro de scraping:`, recordError.message);
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
