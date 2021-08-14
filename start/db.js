const { Sequelize } = require('sequelize');

const { DB_USER, DB_PASSWORD, DB_NAME, ENVIRONMENT } = process.env;

const log = require('../config/winston');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const sync = async () => {
    try {
        await sequelize.sync();

        log.info(`DB connected in ${ENVIRONMENT}`);
    } catch (error) {
        log.error(error);

        log.error(`DB failed connection connected in ${ENVIRONMENT}`);
    }
};

const close = async () => {
    try {
        await sequelize.close();
        log.info(`DB closed in ${ENVIRONMENT}`);
    } catch (error) {
        log.error(error);

        log.error(`DB failed closing in ${ENVIRONMENT}`);
    }
};

module.exports = { sequelize, sync, close };
