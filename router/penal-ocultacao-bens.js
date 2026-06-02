const PenalOcultacaoBens = require('../models/penal-ocultacao-bens');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const penalOcultacaoBens = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/leis/l9613.htm";
const MODEL_NAME = 'penal-ocultacao-bens';

/**
 * @swagger
 * /penalOcultacaoBens:
 *   get:
 *     summary: Retorna a Lei de Lavagem de Dinheiro
 *     description: Obtém o conteúdo completo da Lei nº 9.613/1998 (Crimes de Ocultação de Bens, Direitos e Valores) com URL de referência e data do último scraping
 *     tags:
 *       - Penal
 *     responses:
 *       200:
 *         description: Lei de Lavagem de Dinheiro recuperada com sucesso
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
penalOcultacaoBens.get('/', async (req, res) => {
    try {
        const dados = await PenalOcultacaoBens.findOne({ where: { id: 1 } });
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
 * /penalOcultacaoBens/status:
 *   get:
 *     summary: Status da Lei de Lavagem de Dinheiro
 *     description: Retorna informações sobre o último scraping e status dos dados da Lei nº 9.613/1998
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
penalOcultacaoBens.get('/status', async (req, res) => {
    try {
        const dados = await PenalOcultacaoBens.findOne({ where: { id: 1 } });
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
 * /penalOcultacaoBens/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato da Lei de Lavagem de Dinheiro
 *     description: Inicia um scraping imediato da Lei nº 9.613/1998 de forma assíncrona
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
penalOcultacaoBens.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, PenalOcultacaoBens, MODEL_NAME);
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

module.exports = penalOcultacaoBens;