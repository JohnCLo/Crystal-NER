const nr = require("name-recognition");
const fs = require("fs");
const { Parser } = require("json2csv");

// Example -------------------------------------------------------//
const txt =
  "The county municipal building on Monroe Avenue is named for former County Executive Edwin Michaels and county-owned Allen park in Somers is named to memorialize former County Executive Alfred DelCampo. Edwin Michaels is currently retired and living in South Palmetto County.";
var namesFound;
namesFound = nr.find(txt);
//console.log(namesFound) // returns 4 names: Edwin Michaels, Allen park, Alfred DelCampo, Edwin Michaels
namesFound = nr.find(txt, { capitalized: true, unique: true });
//console.log(namesFound); // returns 2 names: Edwin Michaels, Alfred DelCampo

//Extract and Add Additonal Names (may be Officer names) ---------//
const rawdata = fs.readFileSync("fatalEncounters.json");
const parsed = JSON.parse(rawdata);

const appendNamesColumn = [];
parsed.map(function (item) {
  var description = item[
    "A brief description of the circumstances surrounding the death"
  ]
    ? item["A brief description of the circumstances surrounding the death"]
    : "";
  var names = nr.find(description);
  console.log(item["Subject's name"]);
  var additionalNames = [];
  names.map(function (nameFound) {
    if (nameFound.name !== item["Subject's name"]) {
      additionalNames.push(nameFound.name);
    }
  });
  item["AdditionalNames"] = additionalNames;
  appendNamesColumn.push(item);
});

// Convert to CSV for export -------------------------------------//
const fields = Object.keys(appendNamesColumn[0]);
const opts = { fields };
const parser = new Parser(opts);

const csv = parser.parse(appendNamesColumn);
fs.writeFile("fatalEncountersWithNames.csv", csv, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("converted to csv");
});
