const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PenalMariaPenha = db.define('penal_maria_penha',{
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
PenalMariaPenha.sync();

module.exports = PenalMariaPenha