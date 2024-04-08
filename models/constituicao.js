const Sequezile = require('sequelize');
const db = require('../config/conexao');

const Constituicao = db.define('constituicao',{
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
Constituicao.sync();

module.exports = Constituicao