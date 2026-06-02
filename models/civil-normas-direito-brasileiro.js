const Sequelize = require('sequelize');
const db = require('../config/conexao');

const CivilNormas = db.define('civil_normas_direito',{
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
CivilNormas.sync({ alter: true });

module.exports = CivilNormas
