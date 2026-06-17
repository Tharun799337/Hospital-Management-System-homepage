const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\ADMIN\\Downloads\\Haveda_Hospital_New.html', 'utf8');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
  // Let's write the CSS to src/reference-styles.css
  fs.writeFileSync('src/reference-styles.css', styleMatch[1].trim());
  console.log('Successfully extracted styles to src/reference-styles.css');
} else {
  console.log('No <style> tag found.');
}
