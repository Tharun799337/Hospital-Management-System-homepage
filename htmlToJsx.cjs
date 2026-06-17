const fs = require('fs');

function htmlToJsx(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/style="([^"]*)"/g, (match, p1) => {
      const styles = p1.split(';').filter(s => s.trim().length > 0).map(s => {
        const parts = s.split(':');
        if (parts.length < 2) return '';
        let key = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        const val = parts.slice(1).join(':').trim();
        return `${key}: "${val}"`;
      }).filter(s => s.length > 0).join(', ');
      return `style={{ ${styles} }}`;
    })
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/<img(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) {
        return match.replace(/>$/, ' />');
      }
      return match;
    })
    .replace(/<hr(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) {
        return match.replace(/>$/, ' />');
      }
      return match;
    })
    .replace(/<input(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) {
        return match.replace(/>$/, ' />');
      }
      return match;
    })
    .replace(/<!--[\s\S]*?-->/g, '');
}

const files = [
  { in: 'section_1.html', out: 'src/components/ServicesSection.tsx', name: 'ServicesSection' },
  { in: 'section_6.html', out: 'src/components/HealthTipsSection.tsx', name: 'HealthTipsSection' },
  { in: 'section_7.html', out: 'src/components/NewsSection.tsx', name: 'NewsSection' },
  { in: 'section_8.html', out: 'src/components/AwardsSection.tsx', name: 'AwardsSection' }
];

files.forEach(f => {
  const html = fs.readFileSync(f.in, 'utf8');
  const jsx = htmlToJsx(html);
  const content = `import React from 'react';\n\nexport default function ${f.name}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
  fs.writeFileSync(f.out, content);
  console.log(`Wrote ${f.out}`);
});
