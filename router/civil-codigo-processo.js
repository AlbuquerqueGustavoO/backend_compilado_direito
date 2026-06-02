const CivilProcesso = require('../models/civil-codigo-processo');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const civilProcesso = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm";
const MODEL_NAME = 'civil-codigo-processo';

/**
 * @swagger
 * /civil-codigo-processo:
 *   get:
 *     summary: Retorna o Código de Processo Civil
 *     description: Obtém o conteúdo completo do Código de Processo Civil com URL de referência e data do último scraping
 *     tags:
 *       - Civil
 *     responses:
 *       200:
 *         description: Código de Processo Civil recuperado com sucesso
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
// Endpoint GET / - Retorna conteúdo salvo
civilProcesso.get('/', async (req, res) => {
    try {
        const dados = await CivilProcesso.findOne({ where: { id: 1 } });
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
 * /civil-codigo-processo/status:
 *   get:
 *     summary: Status do Código de Processo Civil
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
// Endpoint GET /status - Retorna informações de status
civilProcesso.get('/status', async (req, res) => {
    try {
        const dados = await CivilProcesso.findOne({ where: { id: 1 } });
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
 * /civil-codigo-processo/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato
 *     description: Inicia um scraping imediato do Código de Processo Civil de forma assíncrona
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
// Endpoint POST /scrape-agora - Executa scraping imediato
civilProcesso.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, CivilProcesso, MODEL_NAME);
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

module.exports = civilProcesso;
