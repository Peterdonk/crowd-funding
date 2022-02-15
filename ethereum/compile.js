const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');



 var input = {
    language: 'Solidity',
    sources: {
        'campaign' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

var output = JSON.parse(solc.compile(JSON.stringify(input)));
var mainOutput = output.contracts["campaign"];

fs.ensureDirSync(buildPath);

for (let contract in mainOutput) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract + '.json'),
        mainOutput[contract]
    );
}