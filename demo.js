const mysql = require("mysql");
const { conn_00, conn_0 } = require("./db");
const sendmail = require("./sendmail");

let usermail = [
  "pradeep.padmukhi@vivaconnect.co",
  "rahul.pawar@vivaconnect.co",
  "ashish.choubey@vivaconnect.co",
];

let drop_table_query = "Drop table table_info;";
conn_0.query(drop_table_query, function (err, result) {
  if (err) throw err;
  console.log("Droped table Key_MIS", result);
});

let createTable =
  "create table IF NOT EXISTS table_info (Id int not null primary key, Name varchar(40), Message varchar(300), role varchar(20));";
  conn_0.query(createTable, function (err, result) {
  if (err) throw err;
  console.log("created table Key_MIS");
});



let dataArr = [];

const get_data_1 = () => {
  let conn_1_query = "SELECT * FROM info";
  conn_00.query(conn_1_query, (err, result) => {
    if (err) throw err;
    let jsondata = JSON.parse(JSON.stringify(result));
    dataArr.push(...jsondata);
    get_data_2();
  });
};

const get_data_2 = () => {
  let conn_2_query = "SELECT * FROM info";
  conn_0.query(conn_2_query, (err, result) => {
    if (err) throw err;
    let jsondata = JSON.parse(JSON.stringify(result));
    dataArr.push(...jsondata);
    console.log("dataArr", dataArr);

    let newarr = [];
    for (let i = 0; i < dataArr.length; i++) {
      var val = Object.values(dataArr[i]);
      newarr.push(val);
    }
    console.log("---newarr---", newarr);
    get_data_3(newarr);
  });
};

let dum = [
  [5, "Pradeep", "Hello", "webdev"],
  [6, "Riya", "Hey", "webdev"],
  [7, "Dugu", "Hi", "webdev"],
  [8, "giri", "Hiii", "webdev"],
];

const get_data_3 = (demo) => {
  let conn_3_query =
    "INSERT INTO table_info (Id, Name, Message, role) VALUES ?";
  conn_0.query(conn_3_query, [demo], (err, result) => {
    if (err) throw err;
    let jsondata = JSON.parse(JSON.stringify(result));
    console.log("---inserted data---", jsondata);
    get_data_from_db();
  });
};

const get_data_from_db = () => {
  let get_data_query = "SELECT * FROM table_info";
  conn_0.query(get_data_query, (error, row) => {
    if (error) throw error;

    let jsaondata = JSON.parse(JSON.stringify(row));
    console.log("--jsaondata--", jsaondata);

    let Table = "";
    Table += `<table style=" border: 1px solid black; border-collapse: collapse; color: black">
          <tr>
              <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">Id</th>
              <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">Name</th>
              <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">Message</th>
              <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">role</th>
          </tr>`;

    for (let i = 0; i < jsaondata.length; i++) {
      Table += `<tr>
              <td style=" border: 1px solid black; text-align: center;">${jsaondata[i].Id}</td>
              <td style=" border: 1px solid black; text-align: center;">${jsaondata[i].Name}</td>
              <td style=" border: 1px solid black; text-align: center;">${jsaondata[i].Message}</td>
              <td style=" border: 1px solid black; text-align: center;">${jsaondata[i].role}</td>
          </tr>
          `;
    }
    Table += `</table>`;

    sendmail.sendTable_to_mail(usermail, Table);
  });
};

// get_data_1(conn_1_query).then((val) => {
//   console.log("---",val);
// });
get_data_1();
