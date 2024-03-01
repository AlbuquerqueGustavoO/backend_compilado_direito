const Sequezile = require('sequelize');
const db = require('../config/conexao');

const User = db.define('usuarios',{
    id:{
        type: Sequezile.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequezile.STRING,
        allowNull: false,
    },
    email: {
        type: Sequezile.STRING,
        allowNull: false,
    }  
});
//Quando não existir a tabela o comando abaixo vai criar a tabela
User.sync();

module.exports = User