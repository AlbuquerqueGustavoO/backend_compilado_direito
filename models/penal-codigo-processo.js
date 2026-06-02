const Sequelize = require('sequelize');
const db = require('../config/conexao');

const PenalCodigoProcesso = db.define('penal_codigo_processo',{
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
PenalCodigoProcesso.sync({ alter: true });

module.exports = PenalCodigoProcesso
