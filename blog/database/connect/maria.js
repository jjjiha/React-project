const maria = require('mysql');

const conn = maria.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'jiha',
    password: '1234',
    database: 'testdb'
});

module.exports = conn;