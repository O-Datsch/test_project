const fs = require('fs');
const path = require('path');

const baseUrl = 'https://o-datsch.github.io/test_project'; // <-- URL deiner GitHub Pages Seite
const publicDir = './'; // Projektverzeichnis
const outputFile = 'sitemap.xml';

const changefreq = 'monthly';
const priorityDefault = 0.8;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function toUrl(filePath) {
  return filePath
    .replace(/^\.\//, '')        // remove ./ at beginning
    .replace(/\\/g, '/')         // windows compatibility
    .replace(/index\.html$/, '') // optional: strip index.html from URLs
}

const files = getHtmlFiles(publicDir);

const urls = files.map((file) => {
  const stat = fs.statSync(file);
  const lastmod = formatDate(stat.mtime);
  const url = `${baseUrl}/${toUrl(file)}`;

  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${url.endsWith('/') ? '1.0' : priorityDefault}</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(outputFile, sitemap.trim());
console.log(`✅ sitemap.xml mit ${files.length} Seiten erzeugt.`);

// === ROBOTS.TXT ERSTELLEN ===
const robotsTxt = `
User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`.trim();

fs.writeFileSync('robots.txt', robotsTxt);
console.log('✅ robots.txt erstellt.');
