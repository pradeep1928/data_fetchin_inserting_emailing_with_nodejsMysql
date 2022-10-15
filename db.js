const mysql = require("mysql");

const conn_00 = mysql.createConnection({
  host: "localhost",
  user: "pradeep19",
  password: "Pradeep@1910M",
  database: "mydemo",
});

const conn_0 = mysql.createConnection({
  host: "localhost",
  user: "pradeep19",
  password: "Pradeep@1910M",
  database: "smsdb",
});


module.exports = {
  conn_00,
  conn_0,
};
