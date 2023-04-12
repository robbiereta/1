'use strict';
const excelToJson = require('convert-excel-to-json');
 
const result = excelToJson({
    sourceFile: '1.xlsx',
    sheets: [{
        name: 'Refacc  Kurazai-Carabela-Islo',
        range: 'B11:H36710'
    }]
});
 console.log(result)
 var html_tablify = require('html-tablify');
var options = {
    data: [result]
};
var html_data = html_tablify.tablify(options);

const main= document.getElementById('main')
