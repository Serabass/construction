var glob = require('glob');
var fs = require('fs');

function copy(src, dest) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}

glob('config/*.sample.js', function (err, files) {
    files.forEach(function (file) {
        var newFileName = file.replace(/\.sample(\.\w+)$/, '$1');
        if ( ! fs.existsSync(newFileName)) {
            copy(file, newFileName)
        }
    });
});
