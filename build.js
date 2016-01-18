(() => {
    var noParseLibs = [
        'react',
        'react-dom'
    ].map((lib) => {
        return require.resolve(lib);
    });

    module.exports = {
        "noParseLibs": noParseLibs,
        "bundles": [
            {
                "in": [
                    "./src/client/index.js"
                ],
                "out": "client.js"
            }, {
                "in": [
                    "./src/preferences/index.js"
                ],
                "out": "preferences.js"
            }
        ]
    }
})();