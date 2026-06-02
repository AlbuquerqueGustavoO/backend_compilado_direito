const Sequelize = require('sequelize');
const db = require('../config/conexao');

const PenalDrogas = db.define('penal_drogas',{
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
PenalDrogas.sync({ alter: true });

module.exports = PenalDrogas
