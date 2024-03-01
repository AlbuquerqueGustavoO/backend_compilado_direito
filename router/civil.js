const { Router } = require('express');

const rotaSacraping = new Router();
const Civil = require('../models/civil');

rotaSacraping.get("/", async (req, res, error) => {
    try {
        const conteudo = await Civil.findAll({ });
        res.json(conteudo);
    } catch (err) {
        res.json({ err: error, massage: error.massage });
    }
});


module.exports = rotaSacraping;