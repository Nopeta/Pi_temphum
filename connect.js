const mysql = require('mysql2/promise')
const mysql2 = require('mysql2')
const config = require("./config.json")

const opt = {
    host: config.mysql_host,
    user: config.mysql_username,
    password: config.mysql_password,
    database: config.mysql_databasename,
    port: config.mysql_port
}


async function search(i, sql_def) {
    let sql = 'SELECT * FROM information';

    // create the connection
    const connection = await mysql.createConnection(opt);
    // query database

    switch (i) {
        case 1: { //取得數量
            const [rows, fields] = await connection.execute(sql);
            console.log(rows.length);
            return rows.length;
            // break;
        }
        case 2: {
            const [rows, fields] = await connection.execute(sql);
            return rows;
        }
        default: { break; }
    }
    connection.end();
}

function insert(uid, temperature, humidity, datetime) {
    let sql = `INSERT INTO information(uid,temp, hum, datetime)
           VALUES(?,?,?,?)`;
    const in_value = [uid, temperature, humidity, datetime]

    // create the connection
    const con = mysql2.createConnection(opt);
    con.query(sql, in_value, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('information:' + results.insertId);
    });
    con.end();

}

// insert(3, 26, 69, "2022-09-27 23:23:23")

module.exports = { search, insert };