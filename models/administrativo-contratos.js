const Sequezile = require('sequelize');
const db = require('../config/conexao');

const AdministrativoContratos = db.define('administrativo_contratos',{
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
AdministrativoContratos.sync();

module.exports = AdministrativoContratos