const Sequelize = require('sequelize');
const db = require('../config/conexao');

const AdministrativoImprobidade = db.define('administrativo_improbidade',{
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
AdministrativoImprobidade.sync({ alter: true });

module.exports = AdministrativoImprobidade
