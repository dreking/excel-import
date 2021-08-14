const { DataTypes } = require('sequelize');

const sequelize = require('../start/db').sequelize;

const Data = sequelize.define('data', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    nid: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
});

module.exports = Data;
