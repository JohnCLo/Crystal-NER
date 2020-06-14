const csvFilePath = './fatalEncounters.csv'
const csv = require('csvtojson')
const fs = require('fs')


csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
	const formatted = JSON.stringify(jsonObj);
	fs.writeFile("fatalEncounters.json", formatted, function(err) {
    	if(err) {return console.log(err)}
    	console.log("File converted to json");
	}); 
})