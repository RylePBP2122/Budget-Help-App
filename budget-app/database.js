var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'user_database',
    user: 'root',
    password: 'password'
});

module.exports = connection;