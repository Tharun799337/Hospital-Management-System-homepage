const fs = require('fs');
const content = fs.readFileSync('src/reference-styles.css', 'utf8');
const imports = [];
const newContent = content.replace(/@import\s+url\([^)]+\);?/g, (match) => {
  imports.push(match);
  return '';
});
if (imports.length > 0) {
  fs.writeFileSync('src/reference-styles.css', imports.join('\n') + '\n\n' + newContent);
  console.log('Fixed @import statements.');
} else {
  console.log('No @import statements found.');
}
