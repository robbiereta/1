'use strict';
const excelToJson = require('convert-excel-to-json');
 
const result = excelToJson({
    sourceFile: '1.xlsx',
    sheets: [{
        name: 'Refacc  Kurazai-Carabela-Islo',
        range: 'B11:E36710'
    }]
});
 console.log(result)