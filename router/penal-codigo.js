const pup = require('puppeteer');
const PenalCodigo = require('../models/penal-codigo');
const { Router } = require('express');
const penalCodigo = new Router();
const url = "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm";


async function scraping() {
    try {
        console.log('Iniciando o navegador...');
        const browser = await pup.launch({
            headless: true,
            //executablePath: '/usr/bin/chromium-browser', // se estiver local comentar essa linha
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Opções adicionais
        });
        console.log('Navegador iniciado com sucesso!');
        const page = await browser.newPage();
        console.log('Abrindo a página...');
        await page.goto(url, { timeout: 60000 });
        console.log('Página aberta com sucesso!');

        console.log('Extraindo o conteúdo...');
        // Pegar o corpo da página e remover todos os espaços
        let bodyText = await page.evaluate(() => {
            return document.body.innerText;
        });
        console.log('Conteúdo extraído com sucesso!');

        // Encontrar a posição da frase "Nós, representantes do povo brasileiro"
        const startIndex = bodyText.indexOf('Nós, representantes do povo brasileiro');

        // Se a frase for encontrada, remover todo o conteúdo antes dela
        if (startIndex !== -1) {
            bodyText = bodyText.substring(startIndex);
        } else {
            console.error('Frase "Nós, representantes do povo brasileiro" não encontrada no texto.');
        }

        // Remover as strings específicas
        bodyText = bodyText.replace("CONSTITUIÇÃO DA REPÚBLICA FEDERATIVA DO BRASIL DE 1988Texto compiladoPREÂMBULO", '');
        bodyText = bodyText.replace("PresidênciadaRepúblicaCasaCivilSubchefiaparaAssuntosJurídicosCONSTITUIÇÃODAREPÚBLICAFEDERATIVADOBRASILDE1988VideEmendaConstitucionalnº91,de2016VideEmendaConstitucionalnº106,de2020VideEmendaConstitucionalnº107,de2020(VideEmendaConstitucionalnº132,de2023)Vigência(VideEmendaConstitucionalnº132,de2023)VigênciaEmendasConstitucionaisEmendasConstitucionaisdeRevisãoAtodasDisposiçõesConstitucionaisTransitóriasAtosdecorrentesdodispostono§3ºdoart.5ºÍNDICETEMÁTICOTextocompiladoPREÂMBULO", '');

        // Armazenar no banco de dados
        const data = {
            conteudo: JSON.stringify(bodyText) // Convertendo para JSON antes de armazenar
        };

        // Criar ou atualizar registro no banco de dados
        const [registro, criado] = await PenalCodigo.findOrCreate({
            where: { id: 1 }, // Aqui você pode usar o critério que desejar para encontrar o registro existente
            defaults: data // Dados que serão inseridos se nenhum registro for encontrado
        });

        // Se o registro existir, atualize seus valores
        if (!criado) {
            registro.conteudo = JSON.stringify(data.conteudo); // Convertendo para JSON antes de atualizar
            await registro.save();
        }

        console.log('Fechando o navegador...');
        await browser.close();
        console.log('Navegador fechado com sucesso!');
        console.log('Scraping concluído com sucesso!');
    } catch (error) {
        console.error('Erro durante o scraping:', error);
    }

    // Agendar próxima execução para as 23:00 do próximo dia
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    const timeUntilNextExecution = tomorrow.getTime() - now.getTime();
    setTimeout(scraping, timeUntilNextExecution);
}

scraping();

// Rota GET para obter os dados
penalCodigo.get('/', async (req, res) => {
    try {
        // Obter os dados do banco de dados
        const dados = await PenalCodigo.findOne({ where: { id: 1 } }); // Altere o critério conforme necessário

        if (!dados) {
            return res.status(404).json({ message: 'Nenhum dado encontrado.' });
        }

        // Parse dos dados JSON
        const conteudo = JSON.parse(dados.conteudo);

        // Enviar os dados como resposta
        res.status(200).json({ text: dados.conteudo });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        res.status(500).json({ message: 'Erro ao buscar os dados.' });
    }
});


module.exports = penalCodigo;