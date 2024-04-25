const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PenalDrogas = db.define('penal_drogas',{
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
PenalDrogas.sync();

module.exports = PenalDrogas