const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PenalCodigoProcesso = db.define('penal_codigo_processo',{
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
PenalCodigoProcesso.sync();

module.exports = PenalCodigoProcesso