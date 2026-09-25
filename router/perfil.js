const { Router } = require('express');

const rotas = new Router();
const Perfil = require('../models/perfil');

/**
 * @swagger
 * /perfis:
 *   get:
 *     summary: Lista os perfis de usuário disponíveis
 *     description: Retorna os perfis fixos do sistema (estudante, advogado, admin)
 *     tags:
 *       - Perfil
 *     responses:
 *       200:
 *         description: Lista de perfis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Perfil'
 */
rotas.get("/", async (req, res) => {
    try {
        const perfis = await Perfil.findAll();
        res.json(perfis);
    } catch (err) {
        res.json({ error: true, mensagem: err.message });
    }
});

/**
 * @swagger
 * /perfis/{id}:
 *   get:
 *     summary: Busca um perfil pelo ID
 *     tags:
 *       - Perfil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perfil'
 */
rotas.get("/:id", async (req, res) => {
    try {
        const perfil = await Perfil.findByPk(req.params.id);
        res.json(perfil);
    } catch (err) {
        res.json({ error: true, mensagem: err.message });
    }
});

module.exports = rotas;
