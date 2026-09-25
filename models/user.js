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
        // unique já está garantido por constraint física no banco (aplicada uma vez via migração).
        // Não declarar `unique: true` aqui de propósito: com `sync({ alter: true })`, o Sequelize
        // não reconhece a constraint já existente (o nome que ele gera muda a cada sync) e cria
        // outra em cima a cada restart, acumulando dezenas de índices duplicados.
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
        allowNull: false
        // FK física já aplicada via migração (ver migrarPerfilLegado). Não redeclarar `references`
        // aqui: pelo mesmo motivo do `email`, isso faz o alter recriar a constraint a cada restart.
    }
});

// constraints: false -- a FK física já existe no banco; isso só ensina o Sequelize a fazer o join
// (`include`) sem tentar gerenciar a constraint via sync/alter.
User.belongsTo(Perfil, { foreignKey: 'perfilId', as: 'perfil', constraints: false });
Perfil.hasMany(User, { foreignKey: 'perfilId', constraints: false });

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
