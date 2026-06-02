const ConstituicaoEstadoSP = require('../models/constituicao-estado-sp');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const constituicaoEstadoSp = new Router();

const URL = "https://www.al.sp.gov.br/repositorio/legislacao/constituicao/1989/compilacao-constituicao-0-05.10.1989.html";
const MODEL_NAME = 'constituicao-estado-sp';

/**
 * @swagger
 * /constituicaoEstadoSP:
 *   get:
 *     summary: Retorna a Constituição do Estado de São Paulo
 *     description: Obtém o conteúdo completo da Constituição do Estado de São Paulo de 1989 com URL de referência e data do último scraping
 *     tags:
 *       - Constitucional
 *     responses:
 *       200:
 *         description: Constituição do Estado de São Paulo recuperada com sucesso
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
constituicaoEstadoSp.get('/', async (req, res) => {
    try {
        const dados = await ConstituicaoEstadoSP.findOne({ where: { id: 1 } });
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
 * /constituicaoEstadoSP/status:
 *   get:
 *     summary: Status da Constituição do Estado de São Paulo
 *     description: Retorna informações sobre o último scraping e status dos dados da Constituição do Estado de São Paulo
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
constituicaoEstadoSp.get('/status', async (req, res) => {
    try {
        const dados = await ConstituicaoEstadoSP.findOne({ where: { id: 1 } });
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
 * /constituicaoEstadoSP/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato
 *     description: Inicia um scraping imediato da Constituição do Estado de São Paulo de forma assíncrona
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
constituicaoEstadoSp.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, ConstituicaoEstadoSP, MODEL_NAME);
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

module.exports = constituicaoEstadoSp;