const Sequezile = require('sequelize');
const db = require('../config/conexao');

const AdministrativoParceriaPublica = db.define('administrativo_parceria_publica',{
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
AdministrativoParceriaPublica.sync();

module.exports = AdministrativoParceriaPublica