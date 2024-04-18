const Sequezile = require('sequelize');
const db = require('../config/conexao');

const AdministrativoProcesso = db.define('administrativo_processo',{
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
AdministrativoProcesso.sync();

module.exports = AdministrativoProcesso