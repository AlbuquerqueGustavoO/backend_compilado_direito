const Sequelize = require('sequelize');
const db = require('../config/conexao');

const PenalOcultacaoBens = db.define('penal_ocultacao_bens',{
    id:{
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
},{ freezeTableName: true }
);
PenalOcultacaoBens.sync({ alter: true });

module.exports = PenalOcultacaoBens
