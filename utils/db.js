const mysql = require('mysql2');
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'cool_girls',
    password:''
});
module.exports = pool.promise();