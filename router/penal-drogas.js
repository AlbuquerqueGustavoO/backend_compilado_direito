const PenalDrogas = require('../models/penal-drogas');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const penalDrogas = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11343.htm";
const MODEL_NAME = 'penal-drogas';

/**
 * @swagger
 * /penalDrogas:
 *   get:
 *     summary: Retorna a Lei de Drogas
 *     description: Obtém o conteúdo completo da Lei nº 11.343/2006 com URL de referência e data do último scraping
 *     tags:
 *       - Penal
 *     responses:
 *       200:
 *         description: Lei de Drogas recuperada com sucesso
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
penalDrogas.get('/', async (req, res) => {
    try {
        const dados = await PenalDrogas.findOne({ where: { id: 1 } });
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
 * /penalDrogas/status:
 *   get:
 *     summary: Status da Lei de Drogas
 *     description: Retorna informações sobre o último scraping e status dos dados da Lei nº 11.343/2006
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
penalDrogas.get('/status', async (req, res) => {
    try {
        const dados = await PenalDrogas.findOne({ where: { id: 1 } });
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
 * /penalDrogas/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato da Lei de Drogas
 *     description: Inicia um scraping imediato da Lei nº 11.343/2006 de forma assíncrona
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
penalDrogas.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, PenalDrogas, MODEL_NAME);
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

module.exports = penalDrogas;