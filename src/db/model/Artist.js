
'use strict';

const Sequelize = require('sequelize');

module.exports = function(db) {
    return db.define('artist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        mbArtistId: {
            type: Sequelize.STRING,
            field: 'mb_artist_id'
        }
    });
};