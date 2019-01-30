
// ===============================================================================
// LOAD DATA
// ===============================================================================

var subs = require("../data/sub-data.js");
var irStaff = require("../data/ir-data.js");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {

    app.get("/api/subs", function (req, res) {
        res.json(subs);
        // console.log(subs)
    });

    app.get("/api/universities", function (req, res) {
        // res.json(subs);
        // console.log(subs)
        var universityArr = [];
        for (var i = 1; i < subs.length; i++) {
            if (universityArr.includes(subs[i].university) === false) {

                universityArr.push(subs[i].university)
            }
        }

        universityArr.sort();
        res.json(universityArr)
    });



    app.post("/api/subs", function (req, res) {
        // console.log(req.body.userSelect)
        //    console.log(subs)

        var subArr = []
        for (var i = 1; i < subs.length; i++) {
            if (subs[i].university == req.body.userSelect) {
                subArr.push(subs[i])
            }
        }


        //this part is just to calculate total # of subs
        irCount = 0;
        taSubCount = 0;
        instSubCount = 0;
        totalTAsubbingForInst = 0;
        totalSubCount = subArr.length;
        trueSubArr = [];
        for (var j = 0; j < subArr.length; j++){
            // console.log(subArr[j].subName)
            if(subArr[j].title == "TA" && subArr[j].subbingFor == "Instructor"){
                totalTAsubbingForInst++;
            }
            if(subArr[j].subbingFor == "TA"){
                taSubCount++;
            }else if(subArr[j].subbingFor == "Instructor"){
                instSubCount++;
            }

            //cross-reference to SF data
            if(irStaff.includes(subArr[j].subName) == false){
                // console.log(irStaff[k])
               subArr[j].isSub = true;
               if(trueSubArr.includes(subArr[j].subName) == false){
                trueSubArr.push(subArr[j].subName)
               }
            }else{
                subArr[j].isSub = false;
            }


            for (var k = 0; k < irStaff.length; k++){
                if(subArr[j].subName == irStaff[k]){
                    // console.log(irStaff[k])
                    irCount++;
                }
            }
        }

        

        // console.log(irCount)
        // console.log(totalSubCount)

        var subInfo = {
            taSubCount: taSubCount,
            instSubCount: instSubCount,
            totalTAsubbingForInst: totalTAsubbingForInst,
            subData: JSON.stringify(subArr),
            trueSubs: JSON.stringify(trueSubArr),
            totalIRsubs: irCount,
            totalSubCount: totalSubCount
        }
        console.log(subInfo.subData)
        res.send(subInfo)
    });

    app.post("/api/findsub", function (req, res) {

        var matchingSubArr = [];
        for (var i = 1; i < subs.length; i++) {
            if (subs[i].subName == req.body.subInput) {
                matchingSubArr.push(subs[i])
            }
        }

        res.json(matchingSubArr)
    })
};
