const PenalCrimesHediondos = require('../models/penal-crimes-hediondos');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const penalCrimesHediondos = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/leis/L8072compilada.htm";
const MODEL_NAME = 'penal-crimes-hediondos';

/**
 * @swagger
 * /penalCrimesHediondos:
 *   get:
 *     summary: Retorna a Lei dos Crimes Hediondos
 *     description: Obtém o conteúdo completo da Lei dos Crimes Hediondos (Lei nº 8.072/1990) com URL de referência e data do último scraping
 *     tags:
 *       - Penal
 *     responses:
 *       200:
 *         description: Lei dos Crimes Hediondos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conteudo'
 *       404:
 *         description: Nenhum dado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro ao buscar os dados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
penalCrimesHediondos.get('/', async (req, res) => {
    try {
        const dados = await PenalCrimesHediondos.findOne({ where: { id: 1 } });
        if (!dados) {
            return res.status(404).json({ message: 'Nenhum dado encontrado.' });
        }
        res.status(200).json({ 
            text: dados.conteudo,
            referencia: dados.referencia,
            ultimoScraping: dados.ultimoScraping
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        res.status(500).json({ message: 'Erro ao buscar os dados.' });
    }
});

/**
 * @swagger
 * /penalCrimesHediondos/status:
 *   get:
 *     summary: Status da Lei dos Crimes Hediondos
 *     description: Retorna informações sobre o último scraping e status dos dados da Lei nº 8.072/1990
 *     tags:
 *       - Penal
 *     responses:
 *       200:
 *         description: Status recuperado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       500:
 *         description: Erro ao buscar status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
penalCrimesHediondos.get('/status', async (req, res) => {
    try {
        const dados = await PenalCrimesHediondos.findOne({ where: { id: 1 } });
        res.status(200).json({
            exists: !!dados,
            ultimoScraping: dados?.ultimoScraping,
            referencia: dados?.referencia,
            conteudoLength: dados?.conteudo?.length || 0
        });
    } catch (error) {
        console.error('Erro ao buscar status:', error);
        res.status(500).json({ message: 'Erro ao buscar status.' });
    }
});

/**
 * @swagger
 * /penalCrimesHediondos/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato
 *     description: Inicia um scraping imediato da Lei dos Crimes Hediondos (Lei nº 8.072/1990) de forma assíncrona
 *     tags:
 *       - Penal
 *     responses:
 *       200:
 *         description: Scraping executado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapingResponse'
 *       500:
 *         description: Erro ao executar scraping
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
penalCrimesHediondos.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, PenalCrimesHediondos, MODEL_NAME);
        if (result.success) {
            res.status(200).json({ 
                message: 'Scraping executado com sucesso',
                timestamp: result.timestamp,
                url: result.url
            });
        } else {
            res.status(500).json({ 
                message: 'Erro ao executar scraping',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Erro no endpoint scrape-agora:', error);
        res.status(500).json({ message: 'Erro ao executar scraping.' });
    }
});

module.exports = penalCrimesHediondos;