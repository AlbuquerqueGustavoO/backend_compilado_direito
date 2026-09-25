const Sequezile = require('sequelize');
const db = require('../config/conexao');
const Perfil = require('./perfil');

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
    perfilId: {
        type: Sequezile.INTEGER,
        allowNull: false,
        references: {
            model: Perfil,
            key: 'id'
        }
    }
});

User.belongsTo(Perfil, { foreignKey: 'perfilId', as: 'perfil' });
Perfil.hasMany(User, { foreignKey: 'perfilId' });

async function tabelaExiste(nome) {
    const [rows] = await db.query(
        'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
        { replacements: [nome] }
    );
    return rows.length > 0;
}

// Migração de uma vez só: tabelas antigas tinham a coluna `perfil` (enum) direto em `usuarios`.
// Se ela ainda existir, copia os valores para `perfilId` (FK) e remove a coluna antiga.
async function migrarPerfilLegado() {
    if (!(await tabelaExiste('usuarios'))) {
        return;
    }

    const [colunaPerfil] = await db.query("SHOW COLUMNS FROM usuarios LIKE 'perfil'");
    if (colunaPerfil.length === 0) {
        return;
    }

    console.log('Migrando usuarios.perfil (enum) para usuarios.perfilId (FK)...');

    const [colunaPerfilId] = await db.query("SHOW COLUMNS FROM usuarios LIKE 'perfilId'");
    if (colunaPerfilId.length === 0) {
        await db.query('ALTER TABLE usuarios ADD COLUMN perfilId INT NULL');
    }

    await db.query(`
        UPDATE usuarios u
        JOIN perfis p ON p.nome = u.perfil
        SET u.perfilId = p.id
        WHERE u.perfilId IS NULL
    `);

    await db.query('ALTER TABLE usuarios DROP COLUMN perfil');

    console.log('Migração de usuarios.perfil concluída.');
}

Perfil.pronto
    .then(migrarPerfilLegado)
    .then(() => User.sync({ alter: true }))
    .catch((err) => console.error('Erro ao sincronizar usuarios/perfis:', err.message));

module.exports = User;
