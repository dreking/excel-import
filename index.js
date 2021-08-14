require('dotenv').config();
require('express-async-errors');

const app = require('./app');
const log = require('./config/winston');

process.on('uncaughtException', (error) => {
    log.exceptions.handle(error);
});

process.on('unhandledRejection', (error) => {
    throw error;
});

const { PORT } = process.env;

app.listen(PORT, () => log.info(`Listening on port ${PORT}`));
