import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const contentDir = './eintraege';
const outputDir = './';
const templateDir = './templates';

const header = fs.readFileSync(path.join(templateDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(templateDir, 'footer.html'), 'utf8');

let listItems = '';

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

files.forEach(filename => {
  const markdown = fs.readFileSync(path.join(contentDir, filename), 'utf8');
  const html = marked(markdown);

  const title = markdown.match(/^# (.+)/)?.[1] || 'Unbenannt';
  const preview = markdown.split('\n').slice(1).join(' ').substring(0, 150);
  const slug = filename.replace('.md', '');

  listItems += `
    <li class="glossar-card">
      <a href="seiten/${slug}.html">
        <h3>${title}</h3>
        <p>${preview}</p>
        <span class="category-tag">Allgemein</span>
      </a>
    </li>`;
});

const outputHtml = `${header}\n<ul id="glossar-list">\n${listItems}\n</ul>\n${footer}`;
fs.writeFileSync(path.join(outputDir, 'index.html'), outputHtml, 'utf8');
console.log('✅ index.html erfolgreich erzeugt.');
