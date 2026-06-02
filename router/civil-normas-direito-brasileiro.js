const CivilNormas = require('../models/civil-normas-direito-brasileiro');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const civilNormas = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm";
const MODEL_NAME = 'civil-normas-direito-brasileiro';

/**
 * @swagger
 * /civil-direito-brasileiro:
 *   get:
 *     summary: Retorna a Lei de Introdução às Normas do Direito Brasileiro (LINDB)
 *     description: Obtém o conteúdo completo do Decreto-Lei nº 4.657/1942 com URL de referência e data do último scraping
 *     tags:
 *       - Civil
 *     responses:
 *       200:
 *         description: LINDB recuperada com sucesso
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
civilNormas.get('/', async (req, res) => {
    try {
        const dados = await CivilNormas.findOne({ where: { id: 1 } });
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
 * /civil-direito-brasileiro/status:
 *   get:
 *     summary: Status da Lei de Introdução às Normas do Direito Brasileiro (LINDB)
 *     description: Retorna informações sobre o último scraping e status dos dados
 *     tags:
 *       - Civil
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
civilNormas.get('/status', async (req, res) => {
    try {
        const dados = await CivilNormas.findOne({ where: { id: 1 } });
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
 * /civil-direito-brasileiro/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato
 *     description: Inicia um scraping imediato da Lei de Introdução às Normas do Direito Brasileiro (Decreto-Lei nº 4.657/1942) de forma assíncrona
 *     tags:
 *       - Civil
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
civilNormas.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, CivilNormas, MODEL_NAME);
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

module.exports = civilNormas;
