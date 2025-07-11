const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const inputDir = 'eintraege';
const outputDir = 'seiten';
const layoutPath = 'templates/layout.html';

const layout = fs.readFileSync(layoutPath, 'utf-8');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const md = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  const html = marked.parse(md);

  const titleMatch = md.match(/^# (.+)/);
  const title = titleMatch ? titleMatch[1] : 'Glossar-Eintrag';

  const contentText = md.replace(/^#.+\n/, '').slice(0, 160).trim();
  const description = contentText.replace(/\n/g, ' ');

  const finalHtml = layout
    .replace('{{title}}', title)
    .replace('{{description}}', description)
    .replace('{{content}}', html);

  const outputFilename = file.replace('.md', '.html');
  fs.writeFileSync(path.join(outputDir, outputFilename), finalHtml);
  console.log(`✅ ${outputFilename} generiert`);
});
