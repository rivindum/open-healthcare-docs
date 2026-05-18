/**
 * Docusaurus uses a hardcoded Oct 14, 2018 timestamp in development for
 * showLastUpdateTime. This patch makes dev use real git commit dates instead.
 */
const fs = require('fs');
const path = require('path');

const PATCH_MARKER = 'open-healthcare-docs-git-last-update';
const target = path.join(
  __dirname,
  '../node_modules/@docusaurus/plugin-content-docs/lib/docs.js',
);

if (!fs.existsSync(target)) {
  console.warn(
    '[enable-git-last-update] Skipped: @docusaurus/plugin-content-docs not installed.',
  );
  process.exit(0);
}

let content = fs.readFileSync(target, 'utf8');

if (content.includes(PATCH_MARKER)) {
  process.exit(0);
}

const pattern =
  /\/\/ Use fake data in dev for faster development\.\s*const fileLastUpdateData = process\.env\.NODE_ENV === 'production'\s*\? await \(0, lastUpdate_1\.getFileLastUpdate\)\(filePath\)\s*: \{\s*author: 'Author',\s*timestamp: 1539502055,\s*\};/;

const replacement = `// ${PATCH_MARKER}: always read git history for last-update metadata.
        const fileLastUpdateData = await (0, lastUpdate_1.getFileLastUpdate)(filePath);`;

if (!pattern.test(content)) {
  console.warn(
    '[enable-git-last-update] Skipped: expected Docusaurus source pattern not found (version mismatch?).',
  );
  process.exit(0);
}

fs.writeFileSync(target, content.replace(pattern, replacement));
console.log(
  '[enable-git-last-update] Patched Docusaurus to use git last-update dates in development.',
);
