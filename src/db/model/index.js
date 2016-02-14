
module.exports = function(db) {
    return {
        Item: require('./Item')(db),
        Artist: require('./Artist')(db),
        Album: require('./Album')(db),
        Tag: require('./Tag')(db)
    };
};

