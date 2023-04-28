"use strict";
const excelToJson = require("convert-excel-to-json");

const result = excelToJson({
  sourceFile: "1.xlsx",
  sheets: [
    {
      name: "Refacc  Kurazai-Carabela-Islo",
      range: "B11:H36710",
    },
  ],
});
console.log(result);

const fs = require("fs");
const customer = {
  name: "Newbie Co.",
  order_count: 0,
  address: "Po Box City",
};
const jsonString = JSON.stringify(result);
fs.writeFile("./kur.json", jsonString, (err) => {
  if (err) {
    console.log("Error writing file", err);
  } else {
    console.log("Successfully wrote file");
  }
});
