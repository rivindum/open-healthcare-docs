/**
 * Normalize image references for Docusaurus:
 * - HTML <img> tags -> markdown images
 * - Relative assets/img paths -> /assets/img/... (served from static/)
 */
const fs = require('fs');
const path = require('path');

const docsRoot = path.join(__dirname, '../docs');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function toAssetPath(src) {
  const relative = src.match(/^(?:\.\.\/)+assets\/img\/(.+)$/);
  if (relative) {
    return `/assets/img/${relative[1]}`;
  }
  if (src.startsWith('/assets/img/')) {
    return src;
  }
  if (src.startsWith('assets/img/')) {
    return `/${src}`;
  }
  return src;
}

function fixContent(content) {
  let updated = content;

  updated = updated.replace(
    /<img\s+src="([^"]+)"[^>]*\/?>\s*(?:<br\s*\/?>)?/gi,
    (_, src) => {
      const assetPath = toAssetPath(src.trim());
      const name = path.basename(assetPath, path.extname(assetPath));
      const label = name.replace(/[-_]+/g, ' ');
      return `![${label}](${assetPath})\n\n`;
    },
  );

  updated = updated.replace(
    /!\[([^\]]*)\]\((?:\.\.\/)+assets\/img\/([^)]+)\)/g,
    (_, alt, rest) => `![${alt}](/assets/img/${rest})`,
  );

  updated = updated.replace(
    /<!-- Image removed in Docusaurus migration because source asset is missing in repo -->/g,
    '',
  );

  return updated;
}

let changed = 0;
for (const file of walk(docsRoot)) {
  const original = fs.readFileSync(file, 'utf8');
  const fixed = fixContent(original);
  if (fixed !== original) {
    fs.writeFileSync(file, fixed);
    changed += 1;
    console.log(`updated ${path.relative(docsRoot, file)}`);
  }
}

console.log(`Done. ${changed} file(s) updated.`);
