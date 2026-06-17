const fs = require('fs');
const html = fs.readFileSync('C:/Users/ADMIN/Downloads/Haveda_Hospital_New.html', 'utf8');
const cleanHtml = html.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="[BASE64_IMAGE]"');
const regex = /<section[\s\S]*?<\/section>/g;
const matches = cleanHtml.match(regex);
if (matches) {
  matches.forEach((m, i) => {
    fs.writeFileSync(`section_${i}.html`, m);
    console.log(`Wrote section_${i}.html`);
  });
}
