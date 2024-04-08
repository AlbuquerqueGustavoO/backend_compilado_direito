//const express = require('express');

const { Router } = require('express');

const rotas = new Router();
const User = require('../models/user');
//const Civil = require('../models/civil');

rotas.get("/", async (req, res) => {
    try {
        const users = await User.findAll({});
        res.json(users);
    } catch (err) {
        res.json({ error: true, massage: err.massage });
    }
});

rotas.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const users = await User.findByPk(id);
        res.json(users);
    } catch (err) {
        res.json({ error: true, massage: err.massage });
    }
});

rotas.post("/cadastrar", async (req, res) => {
    console.log(req.body)
    await User.create(req.body)
        .then(() => {
            return res.json({
                error: false,
                mensagem: 'Usuário cadastrado com sucesso!'
            })
        }).catch((err) => {
            return res.status(400).json({
                error: true,
                mensagem: err
            })
        })
});

//alterar registros
rotas.put('/:id', async (req, res) => {
    try {
        const { nome, email } = req.body
        const UserAtualizado = await User.update(
            { nome, email },
            {
                where: { id: req.params.id }
            },
        );
        res.status(200).json({message: 'Atualizado com sucesso!'})
    } catch (err) {
        res.json({ error: true, message: err.mensagem });
    }
});

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