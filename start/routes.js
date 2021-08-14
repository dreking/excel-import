const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const error = require('../middlewares/error');
const routes = require('../routes/index');

const start = (app) => {
    const { ENVIRONMENT } = process.env;

    app.use(cors());
    app.use(helmet());
    if (ENVIRONMENT !== 'PROD') app.use(morgan('dev'));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.use(routes);

    app.get('/', (req, res) => {
        return res.status(200).send(`This is Access Logistics Server in ${ENVIRONMENT}`);
    });

    app.use((req, res) => {
        return res.status(404).json({ status: false, message: 'Page not found' });
    });

    app.use(error);
};

module.exports = start;
