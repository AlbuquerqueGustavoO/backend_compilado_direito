const Sequelize = require('sequelize');
const db = require('../config/conexao');

const PenalOrganizacaoCriminosa = db.define('penal_organizacao_criminosa',{
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
PenalOrganizacaoCriminosa.sync({ alter: true });

module.exports = PenalOrganizacaoCriminosa
