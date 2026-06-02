const Sequelize = require('sequelize');
const db = require('../config/conexao');

const AdministrativoContratos = db.define('administrativo_contratos',{
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
AdministrativoContratos.sync({ alter: true });

module.exports = AdministrativoContratos
