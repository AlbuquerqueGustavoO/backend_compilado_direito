const AdministrativoServidoresPublicos = require('../models/administrativo-servidores-publico');
const scrapingService = require('../services/scraping-service');
const schedulingService = require('../services/scheduling-service');
const { Router } = require('express');
const administrativoServidoresPublicos = new Router();

const URL = "https://www.planalto.gov.br/ccivil_03/leis/l8112compilado.htm";
const MODEL_NAME = 'administrativo-servidores-publico';

/**
 * @swagger
 * /administrativoServidoresPublico:
 *   get:
 *     summary: Retorna o Regime Jurídico dos Servidores Públicos Federais
 *     description: Obtém o conteúdo completo da Lei nº 8.112/1990 com URL de referência e data do último scraping
 *     tags:
 *       - Administrativo
 *     responses:
 *       200:
 *         description: Lei dos Servidores Públicos Federais recuperada com sucesso
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
administrativoServidoresPublicos.get('/', async (req, res) => {
    try {
        const dados = await AdministrativoServidoresPublicos.findOne({ where: { id: 1 } });
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
 * /administrativoServidoresPublico/status:
 *   get:
 *     summary: Status da Lei dos Servidores Públicos Federais
 *     description: Retorna informações sobre o último scraping e status dos dados
 *     tags:
 *       - Administrativo
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
administrativoServidoresPublicos.get('/status', async (req, res) => {
    try {
        const dados = await AdministrativoServidoresPublicos.findOne({ where: { id: 1 } });
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
 * /administrativoServidoresPublico/scrape-agora:
 *   post:
 *     summary: Executar scraping imediato
 *     description: Inicia um scraping imediato da Lei nº 8.112/1990 de forma assíncrona
 *     tags:
 *       - Administrativo
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
administrativoServidoresPublicos.post('/scrape-agora', async (req, res) => {
    try {
        const result = await scrapingService.scrapeUrl(URL, AdministrativoServidoresPublicos, MODEL_NAME);
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

module.exports = administrativoServidoresPublicos;
