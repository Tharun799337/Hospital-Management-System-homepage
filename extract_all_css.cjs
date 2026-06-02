const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\ADMIN\\Downloads\\Haveda_Hospital_New.html', 'utf8');
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n\n');
fs.writeFileSync('src/reference-styles.css', styles);
console.log('Extracted all styles');
