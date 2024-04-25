const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PenalOrganizacaoCriminosa = db.define('penal_organizacao_criminosa',{
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
PenalOrganizacaoCriminosa.sync();

module.exports = PenalOrganizacaoCriminosa