
'use strict';

const Sequelize = require('sequelize');

module.exports = function(db) {
    return db.define('album', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        year: {
            type: Sequelize.INTEGER(4)
        },
        month: {
            type: Sequelize.INTEGER(2)
        },
        day: {
            type: Sequelize.INTEGER(2)
        },
        mbAlbumId: {
            type: Sequelize.STRING,
            field: 'mb_album_id'
        }
    });
};