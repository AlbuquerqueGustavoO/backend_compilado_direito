const Sequezile = require('sequelize');
const db = require('../config/conexao');

const PERFIS = ['estudante', 'advogado', 'admin'];

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
    sobre: {
        type: Sequezile.TEXT,
        allowNull: true,
    },
    email: {
        type: Sequezile.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: Sequezile.STRING,
        allowNull: false,
    },
    perfil: {
        type: Sequezile.ENUM(...PERFIS),
        allowNull: false,
        defaultValue: 'estudante'
    }
});
//Quando não existir a tabela o comando abaixo vai criar a tabela
User.sync();

User.PERFIS = PERFIS;

module.exports = User