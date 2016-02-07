
(function() {
    'use strict';

    const request = require('request');
    const path = require('path');
    const qs = require('querystring');
    const _ = require('underscore');
    const q = require('q');
    const concertoUtils = require('../../utils');

    const RESOURCES = [
        'area',
        'artist',
        'event',
        'instrument',
        'label',
        'recording',
        'release',
        'release-group',
        'series',
        'work',
        'url'
    ];

    const RELATIONSHIPS = RESOURCES.map((res) => `${res}-rels`);
    const USER_AGENT = 'concerto-js/0.0.1 (chrisbenincasa@gmail.com)';
    const MAIN_ENDPOINT = 'http://musicbrainz.org/ws/2/';
    const LUCENE_SPECIAL = /([+\-&|!(){}\[\]\^"~*?:\\\/])/;

    const makeUrl = function(path, params) {
        params.fmt = 'json';
        let query = qs.stringify(params);
        return `${MAIN_ENDPOINT}${path}?${query}`;
    };

    const makeRequest = _.throttle(function(url) {
        let deferred = q.defer();

        let requestOptions = {
            url,
            headers: {
                'User-Agent': USER_AGENT
            }
        };

        request(requestOptions, (err, response) => {
            console.log(response.body);

            if (err) {
                deferred.reject(err, response);
                return;
            }

            deferred.resolve(JSON.parse(response.body));
        });

        return deferred.promise;
    }, 1000);

    const makeSearchQuery = function(query, fields, strict) {
        let queryParts = [];
        let fullQuery;

        let normalizedQuery = query.replace(LUCENE_SPECIAL, (m, $1) => '\\' + $1);

        if (fields) {
            if (strict) {
                queryParts.push(`"${normalizedQuery}"`)
            } else {
                queryParts.push(query.toLowerCase());
            }
        } else {
            queryParts.push(query.toLowerCase());
        }

        _(fields).each((value, key) => {
            let fieldValue = value;

            fieldValue = fieldValue.replace(LUCENE_SPECIAL, (m, $1) => `\\${$1}`);

            if (fieldValue) {
                if (strict) {
                    queryParts.push(`${key}:"${fieldValue}"`)
                } else {
                    fieldValue = fieldValue.toLowerCase();
                    queryParts.push(`${key}:(${fieldValue})`);
                }
            }
        });

        if (strict) {
            fullQuery = queryParts.join(' AND ').trim();
        } else {
            fullQuery = queryParts.join(' ').trim();
        }

        if (!fullQuery) {
            throw new Error
        }

        return fullQuery;
    };

    const doQueryRequest = function(entity, id, includes, params) {
        includes = includes || [];
        params = params || {};
        if (!_.isArray(includes)) {
            includes = [includes];
        }

        if (includes.length) {
            params.inc = includes.join(' ');
        }

        let url = makeUrl(`${entity}/${id}`, params);

        return makeRequest(url);
    };

    const doSearchRequest = function(entity, query, fields, limit, offset, strict) {
        let params = {};
        if (limit) params.limit = limit;
        if (offset) params.offset = offset;
        params.query = makeSearchQuery(query, fields, strict);

        let url = makeUrl(entity, params);

        console.log(url);

        return makeRequest(url);
    };

    class MusicBrainzClient {}

    // Attach search endpoints for each resource
    RESOURCES.forEach(resource => {
        let normalizedResource = concertoUtils.dashToCamel(resource);
        let getMethodName = `get${normalizedResource}ById`;
        let searchMethodName = `search${normalizedResource}`;

        MusicBrainzClient.prototype[getMethodName] = function(id, includes, releaseStatus, releaseType) {
            includes = includes || [];
            releaseStatus = releaseStatus || [];
            releaseType = releaseType || [];
            if (!_.isArray(releaseStatus)) releaseStatus = [releaseStatus];
            if (!_.isArray(releaseType)) releaseType = [releaseType];

            let params = {
                status: releaseStatus.join('|'),
                type: releaseType.join('|')
            };

            return doQueryRequest(resource, id, includes, params);
        };

        MusicBrainzClient.prototype[searchMethodName] = function(query, fields, limit, offset, strict) {
            return doSearchRequest(resource, query, fields, limit, offset, strict);
        };
    });

    module.exports = MusicBrainzClient;
})();