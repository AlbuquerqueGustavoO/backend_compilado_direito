const Constituicao = require('../models/constituicao');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const constituicao = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm";
const MODEL_NAME = 'constituicao';

/**
 * @swagger
 * /constituicao:
 *   get:
 *     summary: Retorna a Constituição Federal de 1988
 *     description: Obtém o conteúdo completo da Constituição da República Federativa do Brasil de 1988 com URL de referência e data do último scraping
 *     tags:
 *       - Constitucional
 *     responses:
 *       200:
 *         description: Constituição Federal recuperada com sucesso
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
constituicao.get('/', async (req, res) => {
    try {
        const dados = await Constituicao.findOne({ where: { id: 1 } });
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
 * /constituicao/status:
 *   get:
 *     summary: Status da Constituição Federal de 1988
 *     description: Retorna informações sobre o último scraping e status dos dados da Constituição Federal
 *     tags:
 *       - Constitucional
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
constituicao.get('/status', async (req, res) => {
    try {
        const dados = await Constituicao.findOne({ where: { id: 1 } });
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
 * /constituicao/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato
 *     description: Inicia um scraping imediato da Constituição Federal de 1988 de forma assíncrona
 *     tags:
 *       - Constitucional
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
constituicao.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, Constituicao, MODEL_NAME);
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

module.exports = constituicao;