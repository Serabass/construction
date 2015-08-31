/// <reference path="../typings/tsd.d.ts" />

export var db:MySQLPromise = require('mysql-promise')();

db.configure({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "construction"
});
