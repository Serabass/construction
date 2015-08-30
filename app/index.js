var express = require('express'),
    app = express(),
    path = require('path'),
    config = require(path.join(__dirname, 'config')),
    expressConfig = config('express')
;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(expressConfig.port, expressConfig.ip);
