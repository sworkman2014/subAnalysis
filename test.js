
var fs = require('fs'); 
var parse = require('csv-parse');

var subData=[];
fs.createReadStream('subs.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        console.log(csvrow[0]);
        //do something with csvrow
        // subData.push(csvrow);      
        function SubConstructor (dateSubmitted, ssm, university, cohort, subName, title, subbingFor, dateSubbed, hours ){
            this.dateSubmitted = dateSubmitted;
            this.ssm = ssm;
            this.university = university;
            this.cohort = cohort;
            this.subName = subName;
            this.title = title;
            this.subbingFor = subbingFor;
            this.dateSubbed = dateSubbed;
            this.hours = hours;
        }  
         var subInstance = new SubConstructor(csvrow[0], csvrow[1], csvrow[2], csvrow[3], csvrow[4], csvrow[5], csvrow[6], csvrow[7], csvrow[8])
        subData.push(subInstance)
    })
    .on('end',function() {
      //do something wiht csvData
      console.log(subData);
      fs.writeFile('sub-data.js', JSON.stringify(subData), function(err, data){
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });

    });