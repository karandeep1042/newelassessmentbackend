const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.HOSTNAME,
    user: "sql12782235",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});



module.exports = pool;