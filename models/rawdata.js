const { DataTypes } = require('sequelize');

const sequelize = require('../start/db').sequelize;

const RawData = sequelize.define('rawdata', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    data: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = RawData;
