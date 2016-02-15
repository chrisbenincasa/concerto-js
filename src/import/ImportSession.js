
'use strict';

const TaskRunner = require('./TaskRunner');
const fs = require('fs');
const highland = require('highland');

class ImportSession {
    constructor(config, library, paths) {
        this.config = config ? config.import : {};
        this.library = library;
        this.paths = paths;
    }

    run() {
        let reader = highland.wrapCallback(fs.readFile);

        return highland(this.paths).flatMap(reader).toArray(highland.log);
    }
}

module.exports = ImportSession;