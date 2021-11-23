const mysql = require('mysql2');
const pool = mysql.createPool({
    host:'162.0.210.227',
    user:'lims_alex',
    database:'lims_alex',
    password:'SvcpilotNnc123*'
});
module.exports = pool.promise();

