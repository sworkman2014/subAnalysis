// for parsing the sf csv to json --> sf-ir-report.csv
var fs = require('fs'); 
var parse = require('csv-parse');

var irDataArr=[];
fs.createReadStream('sf-ir-report.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        console.log(csvrow[0]);
        for(i = 0; i < csvrow.length; i++){
            if(irDataArr.includes(csvrow[i]) == false){
                irDataArr.push(csvrow[i])
            }
        }

        //do something with csvrow
        // subData.push(csvrow);      
        
    })
    .on('end',function() {
        //do something wiht csvData
        console.log(irDataArr);
        fs.writeFile('ir-data.js', JSON.stringify(irDataArr), function(err, data){
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });

    });