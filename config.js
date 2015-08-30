var path = require('path');

module.exports = function (key) {
    return require(path.join(__dirname, 'config', key));
};