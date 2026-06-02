const Sequelize = require('sequelize');
const db = require('../config/conexao');

const TributarioCodigo = db.define('tributario_codigo',{
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
TributarioCodigo.sync({ alter: true });

module.exports = TributarioCodigo
