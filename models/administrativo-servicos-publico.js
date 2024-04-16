const Sequezile = require('sequelize');
const db = require('../config/conexao');

const AdministrativoServicosPublicos = db.define('administrativo_servicos_publicos',{
    id:{
        type: Sequezile.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    conteudo: {
        type: Sequezile.TEXT,
        allowNull: false,
    }
},{ freezeTableName: true }
);
//Quando não existir a tabela o comando abaixo vai criar a tabela
AdministrativoServicosPublicos.sync();

module.exports = AdministrativoServicosPublicos