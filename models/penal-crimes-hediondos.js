const Sequelize = require('sequelize');
const db = require('../config/conexao');

const PenalCrimesHediondos = db.define('penal_crimes_hediondos',{
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
PenalCrimesHediondos.sync({ alter: true });

module.exports = PenalCrimesHediondos
