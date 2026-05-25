const pup = require('puppeteer');
const CivilProcesso = require('../models/civil-codigo-processo');
const { Router } = require('express');
const civilProcesso = new Router();
const url = "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm";


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
        const [registro, criado] = await CivilProcesso.findOrCreate({
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
    tomorrow.setHours(22);
    tomorrow.setMinutes(3);
    tomorrow.setSeconds(0);
    const timeUntilNextExecution = tomorrow.getTime() - now.getTime();
    setTimeout(scraping, timeUntilNextExecution);
}

scraping();

civilProcesso.get('/', async (req, res) => {
    try {
        const dados = await CivilProcesso.findOne({ where: { id: 1 } });
        if (!dados) {
            return res.status(404).json({ message: 'Nenhum dado encontrado.' });
        }
        res.status(200).json({ text: dados.conteudo });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        res.status(500).json({ message: 'Erro ao buscar os dados.' });
    }
});

module.exports = civilProcesso;