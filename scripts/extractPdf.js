const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/extractPdf.js <file.pdf>');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), file);
const dataBuffer = fs.readFileSync(filePath);

pdf(dataBuffer).then(function(data) {
  console.log(data.text);
}).catch((err) => {
  console.error('Failed to parse PDF:', err.message || err);
  process.exit(2);
});
