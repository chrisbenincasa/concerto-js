
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const utils = require('../utils');
const sequelize = new Sequelize('concerto', null, null, {
    dialect: 'sqlite',
    storage: utils.SOURCE_ROOT + '/database.sqlite'
});
let db = {
    model: {}
};

const initAssociations = function(model) {
    // Item relations
    model.Item.belongsTo(model.Album, {
        foreignKey: 'album_id'
    });
    model.Item.belongsToMany(model.Tag, {
        through: 'ItemTags'
    });
    model.Item.hasOne(model.Artist, {
        foreignKey: 'artist_id'
    });
    model.Item.hasOne(model.Artist, {
        as: 'AlbumArtist',
        foreignKey: 'album_artist_id'
    });

    // Album relations
    model.Album.hasMany(model.Artist, {
        foreignKey: 'artist_id'
    });

    // Artist relations
    model.Artist.hasMany(model.Album, {
        foreignKey: 'album_id'
    });

    // Tag relations
    model.Tag.belongsToMany(model.Item, {
        through: 'ItemTags'
    });
};

fs.readdirSync(`${__dirname}/model`).
    filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    }).
    forEach(function(file) {
        var model = sequelize.import(path.join(`${__dirname}/model`, file));
        db.model[model.name] = model;
    });

initAssociations(db.model);

Object.keys(db.model).forEach(function(model) {
    db.model[model].sync();
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


