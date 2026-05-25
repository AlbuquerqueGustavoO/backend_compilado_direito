const pup = require('puppeteer');
const AdministrativoParceriaPublica = require('../models/administrativo-parceria-publica');
const { Router } = require('express');
const administrativoParceriaPublica = new Router();
const url = "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l11079.htm";


async function scraping() {
    try {
        console.log('Iniciando o navegador...');
        const browser = await pup.launch({
            headless: true,
            //executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, { timeout: 60000 });
        console.log('Extraindo o conteúdo...');
        let bodyText = await page.evaluate(() => {
            return document.body.innerText;
        });
        console.log('Conteúdo extraído com sucesso!');
        const data = {
            conteudo: bodyText
        };
        const [registro, criado] = await AdministrativoParceriaPublica.findOrCreate({
            where: { id: 1 },
            defaults: data
        });
        if (!criado) {
            registro.conteudo = bodyText;
            await registro.save();
        }
        await browser.close();
        console.log('Scraping concluído com sucesso!');
    } catch (error) {
        console.error('Erro durante o scraping:', error);
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(3);
    const timeUntilNextExecution = tomorrow.getTime() - now.getTime();
    setTimeout(scraping, timeUntilNextExecution);
}

//scraping();

administrativoParceriaPublica.get('/', async (req, res) => {
    try {
        const dados = await AdministrativoParceriaPublica.findOne({ where: { id: 1 } });
        if (!dados) {
            return res.status(404).json({ message: 'Nenhum dado encontrado.' });
        }
        res.status(200).json({ text: dados.conteudo });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        res.status(500).json({ message: 'Erro ao buscar os dados.' });
    }
});

module.exports = administrativoParceriaPublica;