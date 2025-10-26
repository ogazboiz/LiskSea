const fs = require('fs');
const path = require('path');

// Read the PriceFeed artifact
const priceFeedPath = path.join(__dirname, '../artifacts/contracts/PriceFeed.sol/PriceFeed.json');
const priceFeedArtifact = JSON.parse(fs.readFileSync(priceFeedPath, 'utf-8'));

// Read the current deployedContracts.ts file
const deployedContractsPath = path.join(__dirname, '../../nextjs/contracts/deployedContracts.ts');
let content = fs.readFileSync(deployedContractsPath, 'utf-8');

// Check if PriceFeed already exists
if (content.includes('"PriceFeed"')) {
  console.log('PriceFeed already exists in deployedContracts.ts');
  process.exit(0);
}

// Find the position to insert PriceFeed (after MyNFT but before the closing braces)
// Look for the last occurrence of "},\n  }\n} as const"
const regex = /(    },\n  }\n} as const)/;

// Create the PriceFeed entry with NEW RedStone address
const priceFeedEntry = `    },\n    "PriceFeed": {\n      "address": "0xEE36fd4DDAa47B3678A3618cBD419b890ef4CC78",\n      "abi": ${JSON.stringify(priceFeedArtifact.abi, null, 8).replace(/\n/g, '\n      ')},\n      "inheritedFunctions": {}\n`;

// Replace
const newContent = content.replace(regex, priceFeedEntry + '$1');

// Write back
fs.writeFileSync(deployedContractsPath, newContent);
console.log('Successfully added PriceFeed to deployedContracts.ts');
