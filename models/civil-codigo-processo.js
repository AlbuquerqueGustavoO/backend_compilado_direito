const Sequelize = require('sequelize');
const db = require('../config/conexao');

const CivilProcesso = db.define('civil_codigo_processo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    conteudo: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
    },

    referencia: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    ultimoScraping: {
        type: Sequelize.DATE,
        allowNull: true,
    }

}, {
    freezeTableName: true,
    timestamps: false
});

CivilProcesso.sync({ alter: true });

module.exports = CivilProcesso
