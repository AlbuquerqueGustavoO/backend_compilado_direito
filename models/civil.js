const Sequezile = require('sequelize');
const db = require('../config/conexao');

const Civil = db.define('civil',{
    id:{
        type: Sequezile.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequezile.STRING,
        allowNull: false,
    },
    email: {
        type: Sequezile.STRING,
        allowNull: false,
    },
    conteudo: {
        type: Sequezile.STRING,
        allowNull: false,
    } 
},{ freezeTableName: true }
);
//Quando não existir a tabela o comando abaixo vai criar a tabela
Civil.sync();

module.exports = Civil