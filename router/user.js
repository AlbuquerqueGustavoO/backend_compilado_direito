//const express = require('express');

const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const rotas = new Router();
const User = require('../models/user');
//const Civil = require('../models/civil');

const SENHA_ATTR_EXCLUDE = { exclude: ['senha'] };
const PERFIS_AUTOCADASTRO = User.PERFIS.filter((perfil) => perfil !== 'admin');

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna todos os usuários cadastrados (sem o campo senha)
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
rotas.get("/", async (req, res) => {
    try {
        const users = await User.findAll({ attributes: SENHA_ATTR_EXCLUDE });
        res.json(users);
    } catch (err) {
        res.json({ error: true, mensagem: err.message });
    }
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
rotas.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const users = await User.findByPk(id, { attributes: SENHA_ATTR_EXCLUDE });
        res.json(users);
    } catch (err) {
        res.json({ error: true, mensagem: err.message });
    }
});

/**
 * @swagger
 * /user/cadastrar:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCadastro'
 *     responses:
 *       200:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos ou email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
rotas.post("/cadastrar", async (req, res) => {
    try {
        const { nome, sobre, email, senha, perfil } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: true,
                mensagem: 'Nome, email e senha são obrigatórios!'
            });
        }

        if (perfil && !PERFIS_AUTOCADASTRO.includes(perfil)) {
            return res.status(400).json({
                error: true,
                mensagem: `Perfil inválido! Valores aceitos: ${PERFIS_AUTOCADASTRO.join(', ')}`
            });
        }

        const usuarioExistente = await User.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({
                error: true,
                mensagem: 'Já existe um usuário cadastrado com este email!'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        await User.create({ nome, sobre, email, senha: senhaHash, perfil: perfil || 'estudante' });

        return res.json({
            error: false,
            mensagem: 'Usuário cadastrado com sucesso!'
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            mensagem: err.message
        });
    }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioLogin'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Email ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
rotas.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                error: true,
                mensagem: 'Email e senha são obrigatórios!'
            });
        }

        const usuario = await User.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({
                error: true,
                mensagem: 'Email ou senha inválidos!'
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({
                error: true,
                mensagem: 'Email ou senha inválidos!'
            });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return res.json({
            error: false,
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                sobre: usuario.sobre,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            mensagem: err.message
        });
    }
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobre:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
rotas.put('/:id', async (req, res) => {
    try {
        const { nome, sobre, email, senha } = req.body;
        const dadosAtualizados = { nome, sobre, email };

        if (senha) {
            dadosAtualizados.senha = await bcrypt.hash(senha, 10);
        }

        await User.update(
            dadosAtualizados,
            {
                where: { id: req.params.id }
            },
        );
        res.status(200).json({message: 'Atualizado com sucesso!'})
    } catch (err) {
        res.json({ error: true, mensagem: err.message });
    }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 */
rotas.delete('/:id', async (req, res) => {
    try {
        await User.destroy({
            where: {
              id: req.params.id,
            },
          });
          res.status(200).json({message: 'Usuário removido com sucesso!'})
    } catch (err) {
        res.json({ error: true, message: err.mensagem });
    }
});

module.exports = rotas;