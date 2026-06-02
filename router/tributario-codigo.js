const TributarioCodigo = require('../models/tributario-codigo');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const tributarioCodigo = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm";
const MODEL_NAME = 'tributario-codigo';

/**
 * @swagger
 * /tributarioCodigo:
 *   get:
 *     summary: Retorna o Código Tributário Nacional
 *     description: Obtém o conteúdo completo do Código Tributário Nacional (Lei nº 5.172/1966) com URL de referência e data do último scraping
 *     tags:
 *       - Tributário
 *     responses:
 *       200:
 *         description: Código Tributário Nacional recuperado com sucesso
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
tributarioCodigo.get('/', async (req, res) => {
    try {
        const dados = await TributarioCodigo.findOne({ where: { id: 1 } });
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
 * /tributarioCodigo/status:
 *   get:
 *     summary: Status do Código Tributário Nacional
 *     description: Retorna informações sobre o último scraping e status dos dados do Código Tributário Nacional
 *     tags:
 *       - Tributário
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
tributarioCodigo.get('/status', async (req, res) => {
    try {
        const dados = await TributarioCodigo.findOne({ where: { id: 1 } });
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
 * /tributarioCodigo/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato do Código Tributário Nacional
 *     description: Inicia um scraping imediato do Código Tributário Nacional (Lei nº 5.172/1966) de forma assíncrona
 *     tags:
 *       - Tributário
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
tributarioCodigo.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, TributarioCodigo, MODEL_NAME);
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

module.exports = tributarioCodigo;