
'use strict';

const Sequelize = require('sequelize');

module.exports = function(db) {
    return db.define('tag', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    });
};