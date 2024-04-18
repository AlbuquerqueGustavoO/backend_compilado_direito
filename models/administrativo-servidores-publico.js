const Sequezile = require('sequelize');
const db = require('../config/conexao');

const AdministrativoServidoresPublico = db.define('administrativo_servidores_publico',{
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
AdministrativoServidoresPublico.sync();

module.exports = AdministrativoServidoresPublico