// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'coolgirls',
//     password:''
// });
// module.exports = pool.promise();




const mysql = require('mysql2');
const pool = mysql.createPool({
    host:'62.171.152.109',
    user:'coolgirl_app',
    database:'coolgirl_app',
    password:'SvcpilotNnc123*'
});
module.exports = pool.promise();

