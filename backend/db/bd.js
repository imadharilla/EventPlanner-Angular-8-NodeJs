
const mysql = require('mysql')



var connection = mysql.createPool({
  host : 'localhost' ,
  user : 'root',
  password : 'root',
  database : 'bd_events'
});

module.exports = connection;
