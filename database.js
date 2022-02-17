const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'user_database',
    multipleStatements: true
});

module.exports = connection;

