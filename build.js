(() => {
    'use strict';

    const baseConfig = require('./webpack.config.base');
    const _ = require('underscore');
    const clone = require('clone');

    let bundles = {
        client: {
            name: 'client',
            entry: {
                client: "./src/client/index.js"
            },
            targets: ['web', 'electron']
        },
        preferences: {
            name: 'preferences',
            entry: {
                preferences: "./src/preferences/index.js"
            }
        }
    };

    let bundlesByTarget = {
        web: [bundles.client],
        electron: [bundles.client, bundles.preferences]
    };

    // For each target, create the configuration for each bundle and then flatten
    let configs = _.chain(bundlesByTarget).map((bundles, target) => {
        return _(bundles).map((bundle) => {
            let config = _.extend({}, clone(bundle), clone(baseConfig));
            config.target = target;
            config.output.filename = `[name]-${target}.bundle.js`;
            return config;
        });
    }).flatten().value();

    module.exports = {
        bundles: bundles,
        configs: configs
    }
})();