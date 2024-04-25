const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PenalOcultacaoBens = db.define('penal_ocultacao_bens',{
    id:{
        type: Sequezile.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    conteudo: {
        type: Sequezile.TEXT,
        allowNull: false,
    }
},{ freezeTableName: true }
);
//Quando não existir a tabela o comando abaixo vai criar a tabela
PenalOcultacaoBens.sync();

module.exports = PenalOcultacaoBens