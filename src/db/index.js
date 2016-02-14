
'use strict';

const _ = require('underscore');

const initAssociations = function(model) {
    // Item relations
    model.Item.belongsTo(model.Album, {
        foreignKey: 'album_id'
    });
    model.Item.belongsToMany(model.Tag, {
        through: 'ItamTags'
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

module.exports = function(db) {
    const model = require('./model')(db);

    initAssociations(model);

    _(model).chain().values().each((m) => m.sync());
};


