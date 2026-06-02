const Sequelize = require('sequelize');
const db = require('../config/conexao');

const PenalMariaPenha = db.define('penal_maria_penha',{
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
PenalMariaPenha.sync({ alter: true });

module.exports = PenalMariaPenha
