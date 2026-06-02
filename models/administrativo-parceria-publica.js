const Sequelize = require('sequelize');
const db = require('../config/conexao');

const AdministrativoParceriaPublica = db.define('administrativo_parceria_publica',{
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
AdministrativoParceriaPublica.sync({ alter: true });

module.exports = AdministrativoParceriaPublica
