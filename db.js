const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dbName',
    password: 'yourPassword',
    port: 5432, // choose your port
});

module.exports = pool;

