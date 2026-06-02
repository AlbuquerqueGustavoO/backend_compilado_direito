const PenalOrganizacaoCriminosa = require('../models/penal-organizacao-criminosa');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const penalOrganizacaoCriminosa = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/lei/l12850.htm";
const MODEL_NAME = 'penal-organizacao-criminosa';

/**
 * @swagger
 * /penalOrganizacaoCriminosa:
 *   get:
 *     summary: Retorna a Lei de Organização Criminosa
 *     description: Obtém o conteúdo completo da Lei nº 12.850/2013 com URL de referência e data do último scraping
 *     tags:
 *       - Penal
 *     responses:
 *       200:
 *         description: Lei de Organização Criminosa recuperada com sucesso
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
penalOrganizacaoCriminosa.get('/', async (req, res) => {
    try {
        const dados = await PenalOrganizacaoCriminosa.findOne({ where: { id: 1 } });
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
 * /penalOrganizacaoCriminosa/status:
 *   get:
 *     summary: Status da Lei de Organização Criminosa
 *     description: Retorna informações sobre o último scraping e status dos dados da Lei nº 12.850/2013
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
penalOrganizacaoCriminosa.get('/status', async (req, res) => {
    try {
        const dados = await PenalOrganizacaoCriminosa.findOne({ where: { id: 1 } });
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
 * /penalOrganizacaoCriminosa/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato da Lei de Organização Criminosa
 *     description: Inicia um scraping imediato da Lei nº 12.850/2013 de forma assíncrona
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
penalOrganizacaoCriminosa.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, PenalOrganizacaoCriminosa, MODEL_NAME);
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

module.exports = penalOrganizacaoCriminosa;