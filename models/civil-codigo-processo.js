const Sequezile = require('sequelize');
const db = require('../config/conexao');

const CivilProcesso = db.define('civil_codigo_processo',{
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
CivilProcesso.sync();

module.exports = CivilProcesso