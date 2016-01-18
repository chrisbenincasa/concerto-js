(() => {
    module.exports = {
        "bundles": [
            {
                "in": {
                    client: "./src/client/index.js"
                },
                "out": "client.js"
            }, {
                "in": {
                    preferences: "./src/preferences/index.js"
                },
                "out": "preferences.js"
            }
        ]
    }
})();