const Sequelize = require('sequelize');
const db = require('../config/conexao');

const ScrapingError = db.define('scraping_error', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    routeName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    errorMessage: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    details: {
        type: Sequelize.TEXT('long'),
        allowNull: true
    },
    occurredAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, { freezeTableName: true });

ScrapingError.sync({ alter: true });

module.exports = ScrapingError;
