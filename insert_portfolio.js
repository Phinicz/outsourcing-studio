const fs = require('fs');

// Read the files
const indexLines = fs.readFileSync('index.html', 'utf-8').split('\n');
const newContent = fs.readFileSync('temp_portfolio_items.html', 'utf-8');

// Insert at line 240 (index 239)
indexLines.splice(240, 0, newContent);

// Write back
fs.writeFileSync('index.html', indexLines.join('\n'), 'utf-8');

console.log('Successfully inserted 4 new portfolio items!');
