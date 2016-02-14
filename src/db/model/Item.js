
'use strict';

const Sequelize = require('sequelize');

module.exports = function(db) {
    return db.define('item', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
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
        track: {
            type: Sequelize.INTEGER(2)
        },
        bpm: {
            type: Sequelize.INTEGER
        },
        mbTrackId: {
            type: Sequelize.STRING,
            field: 'mb_track_id'
        },
        acoustidFingerprint: {
            type: Sequelize.STRING,
            field: 'acoustid_fingerprint'
        },
        acoustidId: {
            type: Sequelize.STRING,
            field: 'acoustid_id'
        }
    });
};