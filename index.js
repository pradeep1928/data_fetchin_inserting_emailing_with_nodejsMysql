const mysql = require("mysql");
const { conn_00, conn_0} = require("./db");
const sendmail = require("./sendmail");

let usermail = [
  "pradeep.padmukhi@vivaconnect.co",
  "rahul.pawar@vivaconnect.co",
  "ashish.choubey@vivaconnect.co",
];

const get_data_from_db = () => {
  let all_data = [];

  let get_data_query = "SELECT * FROM table_1 ORDER BY DELIVRDPer ASC";
  conn_0.query(get_data_query, (error, row) => {
    if (error) throw error;
    let lessThan_Sixty = [];
    let lessThan_eightyFour = [];
    let moreThan_eightyFour = [];

    let jsaondata = JSON.parse(JSON.stringify(row));
    // console.log('--jsondata--', jsaondata);
    for (let i = 0; i < jsaondata.length; i++) {
      // console.log("---data---", jsaondata[i])
      if (jsaondata[i].DELIVRDPer <= 60) {
        lessThan_Sixty.push(jsaondata[i]);
      } else if (
        jsaondata[i].DELIVRDPer > 60 &&
        jsaondata[i].DELIVRDPer <= 84
      ) {
        lessThan_eightyFour.push(jsaondata[i]);
      } else {
        moreThan_eightyFour.push(jsaondata[i]);
      }
    }
    const sortIn_descending = (a, b) => {
      return a.TOTAL < b.TOTAL ? 1 : a.TOTAL > b.TOTAL ? -1 : 0;
    };

    lessThan_Sixty.sort(sortIn_descending);
    lessThan_eightyFour.sort(sortIn_descending);
    moreThan_eightyFour.sort(sortIn_descending);

    all_data = [
      ...lessThan_Sixty,
      ...lessThan_eightyFour,
      ...moreThan_eightyFour,
    ];

    console.log("---all_data--- ", all_data);

    const setColor = (all_data) => {
      if (all_data <= 60) {
        return "#ff4040";
      }
      if (all_data > 60 && all_data <= 84) {
        return "yellow";
      }

      if (all_data > 84) {
        return "#77dd77";
      }
    };

    let Table = `<div style="color: black;"> 
    <p style="margin: 0px;"> DELIVRDPer less than 60% color is <span style= " padding: 0 5px; background-color: #ff4040;"> red </span> </p>
    <p style="margin: 0px;"> DELIVRDPer greater than 60% and less than 84% color is <span style= "padding: 0 5px; background-color: yellow;"> yellow </span> </p>
    <p style="margin-top: 0px;"> DELIVRDPer greater than 84% color is light <span style= "padding: 0 5px; background-color: #77dd77;"> green </span> </p>
    </div>`;

    Table += `<div>
    <table style=" border: 1px solid black; border-collapse: collapse; color: black;">
        <tr>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">Username</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">SMSCNAME</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">TOTAL</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">DELIVRD</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">DELIVRDPer</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">SMSC</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">SMSCPer</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">EXPIRED</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">Other</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">OtherPer</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">DND</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">WrongSender</th>
            <th style=" border: 1px solid black; border-collapse: collapse; padding: 0 15px">VendorError</th>
        </tr>`;

    for (let i = 0; i < all_data.length; i++) {
      Table += `<tr>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].Username
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].SMSCNAME
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].TOTAL
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].DELIVRD
            }</td>
            <td style=" border: 1px solid black; text-align: center; background-color:${setColor(
              all_data[i].DELIVRDPer
            )};">${all_data[i].DELIVRDPer}%</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].SMSC
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].SMSCPer
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].EXPIRED
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].Other
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].OtherPer
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].DND
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].WrongSender
            }</td>
            <td style=" border: 1px solid black; text-align: center;">${
              all_data[i].VendorError
            }</td>
        </tr>
        `;
    }
    Table += `</table> </div>`;

    sendmail.sendTable_to_mail(usermail, Table);

    // process.on('exit', function(code) {
    //   return console.log(`exiting the code implicitly ${code}`);
    //   });
    //   setTimeout((function() {
    //   return process.exit(0); //node js exit code
    //   }), 8000);
  });
};

// let conn_1_query = "SELECT * FROM info";
// const get_data_1 = async (query) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       conn_00.query(query, (err, row) => {
//         if (err) throw err;
//         else {
//           let jsondata = JSON.parse(JSON.stringify(row));
//           resolve(jsondata);
//         }
//       });
//     } catch (e) {
//       console.log(e);
//       reject(e)
//     }
//   });
// };

let dataArr = [];
const get_data_1 = () => {
  let conn_1_query = "SELECT * FROM info";
  conn_00.query(conn_1_query, (err, result) => {
    if (err) throw err;
    let jsondata = JSON.parse(JSON.stringify(result));
    dataArr.push(...jsondata);
  });
};

const get_data_2 = () => {
  let conn_2_query = "SELECT * FROM info2";
  conn_00.query(conn_2_query, (err, result) => {
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

const get_data_3 = (dum) => {
  let conn_3_query = "INSERT INTO table_3 (Id, Name, Message, role) VALUES ?";
  conn_0.query(conn_3_query, [dum], (err, result) => {
    if (err) throw err;
    let jsondata = JSON.parse(JSON.stringify(result));
    console.log("---inserted data---", result);
  });
};
// get_data_1();
// get_data_2();

// get_data_1(conn_1_query).then((val) => {
//   console.log("---",val);
// });

get_data_from_db();
