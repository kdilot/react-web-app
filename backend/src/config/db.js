module.exports = () => {

  require('dotenv').config();
  const mysql = require('mysql');
  const conn = mysql.createConnection({
    host: process.env.MRDB_HOST,
    user: process.env.MRDB_USER,
    password: process.env.MRDB_PSW,
    database: process.env.MRDB_DB,
    port: process.env.MRDB_PORT
  })
  conn.connect();

  return conn;
}