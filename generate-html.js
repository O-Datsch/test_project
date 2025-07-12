import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, 'markdown');
const outputDir = path.join(__dirname, 'docs');

fs.readdirSync(inputDir).forEach(file => {
  if (file.endsWith('.md')) {
    const raw = fs.readFileSync(path.join(inputDir, file), 'utf-8');

    // Frontmatter extrahieren
    const { content, data } = matter(raw);
    
    // Markdown zu HTML
    const body = marked(content);

    // Optional: Titel aus Frontmatter verwenden, sonst Dateiname
    const title = data.title || file.replace(/\.md$/, '');

    // Einfaches HTML-Template
    const fullHtml = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${data.description || ''}">
  <link rel="stylesheet" href="../css/styles.css">
  <nav><a href="../index.html">Zurück zur Übersicht</a></nav>
</head>
<body>
	<header><h1>ML Glossar</h1></header>
  <main class="container">
    ${body}
  </main>
  <footer>
    <p>© 2025 Dein Name</p>
  </footer>
</body>
</html>
`;

    // Zieldatei
    const outName = data.filename || file.replace(/\.md$/, '.html');
    fs.writeFileSync(path.join(outputDir, outName), fullHtml);
    console.log(`✔ ${outName} erzeugt`);
  }
});
