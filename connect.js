const mysql = require('mysql2/promise')
const config = require("./config.json")

const opt = {
    host: config.mysql_host,
    user: config.mysql_username,
    password: config.mysql_password,
    database: config.mysql_database_name,
    port: config.mysql_port
}

async function search(sql_def) {
    let sql = config.mysql_sql_search;

    // create the connection
    const connection = await mysql.createConnection(opt);
    // query database
    const sql2 = sql + sql_def;
    const [rows, fields] = await connection.execute(sql2);
    connection.end();
    return rows;
}

async function insert(temperature, humidity, datetime) {
    let sql = config.mysql_sql_insert;
    const in_value = [temperature, humidity, datetime];

    // create the connection
    const con = await mysql.createConnection(opt);
    const [rows, fields] = await con.execute(sql, in_value);
    console.log(rows);
    console.log(fields);
    con.end();
}

module.exports = { search, insert };