var express = require('express'),
    app = express(),
    path = require('path'),
    config = require(path.join(__dirname, '../config')),
    expressConfig = config('express')
;

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./routes/index'));

app.listen(expressConfig.port, expressConfig.ip);
console.log('Server listening on http://%s:%d', expressConfig.ip, expressConfig.port);
