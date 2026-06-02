const Sequelize = require('sequelize');
const db = require('../config/conexao');

const AdministrativoServicosPublicos = db.define('administrativo_servicos_publicos',{
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
AdministrativoServicosPublicos.sync({ alter: true });

module.exports = AdministrativoServicosPublicos
