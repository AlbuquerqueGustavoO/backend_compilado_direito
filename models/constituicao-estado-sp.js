const Sequelize = require('sequelize');
const db = require('../config/conexao');

const ConstituicaoEstadoSP = db.define('constituicao_estado_sp',{
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
ConstituicaoEstadoSP.sync({ alter: true });

module.exports = ConstituicaoEstadoSP
