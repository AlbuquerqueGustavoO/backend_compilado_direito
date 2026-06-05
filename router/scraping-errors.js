const { Router } = require('express');
const ScrapingError = require('../models/scraping-error');
const scrapingErrors = new Router();

/**
 * @swagger
 * /scraping-errors:
 *   get:
 *     summary: Lista erros de scraping
 *     description: Retorna registros de erros ocorridos durante os scrapes. Aceita filtro por `routeName`.
 *     parameters:
 *       - in: query
 *         name: routeName
 *         schema:
 *           type: string
 *         description: Nome da rota para filtrar os erros
 *     responses:
 *       200:
 *         description: Lista de erros retornada com sucesso
 *       500:
 *         description: Erro ao buscar os erros de scraping
 */

scrapingErrors.get('/', async (req, res) => {
    try {
        const { routeName } = req.query;
        const where = {};

        if (routeName) {
            where.routeName = routeName;
        }

        const errors = await ScrapingError.findAll({
            where,
            order: [['occurredAt', 'DESC']]
        });

        res.status(200).json(errors);
    } catch (error) {
        console.error('Erro ao buscar scraping errors:', error);
        res.status(500).json({ message: 'Erro ao buscar os erros de scraping.' });
    }
});

/**
 * @swagger
 * /scraping-errors/{id}:
 *   get:
 *     summary: Retorna um erro de scraping
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Erro de scraping encontrado
 *       404:
 *         description: Erro de scraping não encontrado
 *       500:
 *         description: Erro ao buscar o erro de scraping
 */
scrapingErrors.get('/:id', async (req, res) => {
    try {
        const errorEntry = await ScrapingError.findByPk(req.params.id);

        if (!errorEntry) {
            return res.status(404).json({ message: 'Erro de scraping não encontrado.' });
        }

        res.status(200).json(errorEntry);
    } catch (error) {
        console.error('Erro ao buscar scraping error por id:', error);
        res.status(500).json({ message: 'Erro ao buscar o erro de scraping.' });
    }
});

module.exports = scrapingErrors;
