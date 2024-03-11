const { Router } = require('express');
const router = Router(); // Renomeie o roteador para evitar conflitos
const pup = require('puppeteer');

const url = "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm";

async function scraping() {
    try {
        const browser = await pup.launch({
            headless: true,
            defaultViewport: null,
            executablePath: '/usr/bin/chromium-browser', // Caminho para o executável do Chromium
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Opções adicionais
        });

        const page = await browser.newPage();
        await page.goto(url);

        // Removendo todas as tabelas da página
        await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            tables.forEach(table => table.remove());
        });

        // Capturando o conteúdo da tag body
        let bodyContent = await page.$eval('body', body => body.innerText);

        // Removendo todas as quebras de linha
        bodyContent = bodyContent.replace(/[\n\r]/g, '');

        // Fechar o navegador após a raspagem
        await browser.close();
        console.log('Scraping concluído com sucesso!');

        return bodyContent;
    } catch (error) {
        console.error('Erro durante o scraping:', error);
        throw error;
    }
}

// Middleware para realizar a raspagem e enviar os dados como resposta
router.use(async (req, res, next) => {
    try {
        let data = await scraping(); // Aguardar a conclusão da raspagem

        // Remover a parte específica da string
        data = data.replace("CONSTITUIÇÃO DA REPÚBLICA FEDERATIVA DO BRASIL DE 1988Texto compiladoPREÂMBULO", '');

        // Remover pontos após a palavra "ART"
        data = data.replace(/Art\./g, 'Art');

        res.json({ text: data }); // Enviar a string completa (sem a parte específica e sem os pontos na palavra "ART") para o front-end
    } catch (error) {
        next(error);
    }
});



// Temporizador para executar a raspagem de Leis a cada x milissegundos (por exemplo, a cada hora)
// const intervaloTempo =  60 * 60 * 1000;
// setInterval(async () => {
//     try {
//         console.log('Iniciando raspagem de Leis...');
//         const data = await scraping();
//         console.log('Raspagem de Leis concluída.');
//     } catch (error) {
//         console.error('Erro durante a raspagem de Leis:', error);
//     }
// }, intervaloTempo);

module.exports = router;
