
'use strict';

const TaskRunner = require('./TaskRunner');
const fs = require('fs');
const highland = require('highland');
const _ = require('underscore');
const q = require('q');
const AV = require('av');
const mp3 = require('mp3');
const flac = require('flac.js');

const metadataStream = function(file) {
    let deferred = q.defer();
    let asset = AV.Asset.fromFile(file);

    asset.on('error', deferred.reject);
    asset.get('metadata', deferred.resolve);

    return highland(deferred.promise).errors(function(err, push) { push(null, {}); });
};

class ImportSession {
    constructor(config, library, paths) {
        this.config = config ? config.import : {};
        this.library = library;
        this.paths = paths;
    }

    run() {
        return highland(this.paths).
            flatMap(metadataStream).
            filter(_.negate(_.isEmpty)).
            toArray(highland.log);
    }
}

module.exports = ImportSession;