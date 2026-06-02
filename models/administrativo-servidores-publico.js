const Sequelize = require('sequelize');
const db = require('../config/conexao');

const AdministrativoServidoresPublico = db.define('administrativo_servidores_publico',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    conteudo: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
    },
    referencia: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ultimoScraping: {
        type: Sequelize.DATE,
        allowNull: true,
    }
},{ freezeTableName: true }
);
AdministrativoServidoresPublico.sync({ alter: true });

module.exports = AdministrativoServidoresPublico
