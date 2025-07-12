import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const contentDir = './markdown';
const outputDir = './';
const templateDir = './templates';

const header = fs.readFileSync(path.join(templateDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(templateDir, 'footer.html'), 'utf8');

let listItems = '';

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

files.forEach(filename => {
  const raw = fs.readFileSync(path.join(contentDir, filename), 'utf8');
  const { data, content } = matter(raw); // ⬅️ Frontmatter wird ausgelesen
  const html = marked(content);

  const title = data.title || content.match(/^# (.+)/)?.[1] || 'Unbenannt';
  const description = data.description || content.split('\n')[0];
  const category = data.category || 'Allgemein';
  const slug = filename.replace('.md', '');

  listItems += `
    <li class="glossar-card">
      <a href="docs/${slug}.html">
        <h3>${title}</h3>
        <p>${description}</p>
        <span class="category-tag">${category}</span>
      </a>
    </li>`;
});

const outputHtml = `${header}\n<ul id="glossar-list">\n${listItems}\n</ul>\n${footer}`;
fs.writeFileSync(path.join(outputDir, 'index.html'), outputHtml, 'utf8');
console.log('✅ index.html erfolgreich erzeugt.');
