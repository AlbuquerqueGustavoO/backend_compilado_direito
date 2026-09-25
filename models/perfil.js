const Sequelize = require('sequelize');
const db = require('../config/conexao');

const NOMES_PADRAO = ['estudante', 'advogado', 'admin'];

const Perfil = db.define('perfis', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

Perfil.NOMES_PADRAO = NOMES_PADRAO;

Perfil.pronto = Perfil.sync({ alter: true }).then(async () => {
    for (const nome of NOMES_PADRAO) {
        await Perfil.findOrCreate({ where: { nome } });
    }
    return Perfil;
});

module.exports = Perfil;
