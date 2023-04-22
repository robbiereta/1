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
const jsonfile = require("jsonfile");

const file = "/tmp/data.json";

jsonfile.writeFile(file, result, function (err) {
  if (err) console.error(err);
});
