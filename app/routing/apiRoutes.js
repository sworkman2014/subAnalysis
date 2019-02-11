
// ===============================================================================
// LOAD DATA
// ===============================================================================

var subs = require("../data/sub-data.js");
var irStaff = require("../data/ir-data.js");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
    //route for getting subs from the google sheets subs json
    app.get("/api/subs", function (req, res) {
        res.json(subs);
        // console.log(subs)
    });
    //route for getting unis from the google sheets subs json
    app.get("/api/universities", function (req, res) {
        // res.json(subs);
        // initialize an empty array
        var universityArr = [];
        //itertate through the subs and
        for (var i = 1; i < subs.length; i++) {
            //if the university is not already included in the array,
            if (universityArr.includes(subs[i].university) === false) {
                // push the unique uni to the uni arr
                universityArr.push(subs[i].university)
            }
        }

        universityArr.sort();
        res.json(universityArr)
    });


    //route for posting the subs 
    app.post("/api/subs", function (req, res) {
        // console.log(req.body.userSelect)
        //    console.log(subs)
        // for every value in the subs array, 
        var subArr = []
        for (var i = 1; i < subs.length; i++) {
            // if the user selects a university that is equal to a university in the subs array
            if (subs[i].university == req.body.userSelect) {
                //puts all the subs objects assoc. with that university into the subsArr
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
            // if the sub is not listed in SF as an irStaff
            if(irStaff.includes(subArr[j].subName) == false){
                // console.log(irStaff[k])
                // then they are "true subs" ie their official role: Sub TA
                subArr[j].isSub = true;
                // if the true sub is not already included in the trueSubArr...put them there. 
            if(trueSubArr.includes(subArr[j].subName) == false){
                trueSubArr.push(subArr[j].subName)
            }
            // other wise they are not a true sub
            }else{
                subArr[j].isSub = false;
            }

            // goes through the irStaff and calculates the number of times a staff member, not a true Sub, has subbed
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
    // to return data based on sub searched for
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
