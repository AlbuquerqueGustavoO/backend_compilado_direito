const Sequezile = require('sequelize');
const db = require('../config/conexao');

const ConstituicaoEstadoSP = db.define('constituicao_estado_sp',{
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
ConstituicaoEstadoSP.sync();

module.exports = ConstituicaoEstadoSP