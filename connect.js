const mysql = require('mysql2/promise')
require('dotenv').config();

const opt = {
    host: process.env.mysql_host,
    user: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database_name,
    port: process.env.mysql_port
}
console.log(opt);

async function search(sql_def) {
    let sql = process.env.mysql_sql_search;

    // create the connection
    const connection = await mysql.createConnection(opt);
    // query database
    const sql2 = sql + sql_def;
    const [rows, fields] = await connection.execute(sql2);
    connection.end();
    return rows;
}

async function insert(temperature, humidity, datetime) {
    let sql = process.env.mysql_sql_insert;
    const in_value = [temperature, humidity, datetime];

    // create the connection
    const con = await mysql.createConnection(opt);
    const [rows, fields] = await con.execute(sql, in_value);
    console.log(rows);
    console.log(fields);
    con.end();
}

module.exports = { search, insert };