const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PenalCrimesHediondos = db.define('penal_crimes_hediondos',{
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
PenalCrimesHediondos.sync();

module.exports = PenalCrimesHediondos