/**
 * Re-insert diagram/image markdown removed during the Ballerina-only migration.
 * Source: commit d9cbb97 (last revision with full image references).
 */
const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const SOURCE_COMMIT = 'd9cbb97';
const docsRoot = path.join(__dirname, '../docs');

const GUIDE_FILES = [
  'fhir/guides/building-fhir-bundles.md',
  'fhir/guides/connecting-ehr-emr-systems.md',
  'fhir/guides/exposing-an-api.md',
  'fhir/guides/fhir-repository-connector.md',
  'fhir/guides/fhir-resource-api-template.md',
  'fhir/guides/parsing-and-serializing.md',
  'fhir/guides/populating-fhir-resources.md',
  'fhir/guides/profiles-and-extensions.md',
  'fhir/guides/secure-fhir-apis.md',
  'fhir/guides/validation.md',
  'hl7/guides/populating-hl7-message.md',
  'get-started/introduction.md',
  'get-started/architecture.md',
];

function extractImageLines(content) {
  const lines = [];
  const imgHtml =
    /<img\s+src="([^"]+)"[^>]*\/?>\s*(?:<br\s*\/?>)?/gi;
  let match;
  while ((match = imgHtml.exec(content)) !== null) {
    lines.push(match[0].trim());
  }

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(trimmed)) {
      lines.push(trimmed);
    }
  }

  return lines;
}

function toMarkdownImage(line) {
  return line
    .replace(
      /<img\s+src="([^"]+)"[^>]*\/?>\s*(?:<br\s*\/?>)?/i,
      (_, src) => {
        const relative = src.match(/^(?:\.\.\/)+assets\/img\/(.+)$/);
        const assetPath = relative
          ? `/assets/img/${relative[1]}`
          : src.startsWith('/')
            ? src
            : `/assets/img/${src.replace(/^assets\/img\//, '')}`;
        const name = path.basename(assetPath, path.extname(assetPath));
        return `![${name.replace(/[-_]+/g, ' ')}](${assetPath})`;
      },
    )
    .replace(
      /^!\[([^\]]*)\]\((?:\.\.\/)+assets\/img\/([^)]+)\)$/,
      (_, alt, rest) => `![${alt}](/assets/img/${rest})`,
    );
}

function normalizeForCompare(line) {
  return toMarkdownImage(line).replace(/\s+/g, ' ').trim();
}

let restored = 0;

for (const rel of GUIDE_FILES) {
  const currentPath = path.join(docsRoot, rel);
  if (!fs.existsSync(currentPath)) {
    continue;
  }

  let historical;
  try {
    historical = execSync(
      `git show ${SOURCE_COMMIT}:en/docs/${rel}`,
      {encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']},
    );
  } catch {
    continue;
  }

  const imageLines = extractImageLines(historical).map(toMarkdownImage);
  if (imageLines.length === 0) {
    continue;
  }

  let current = fs.readFileSync(currentPath, 'utf8');
  const existing = new Set(
    extractImageLines(current).map((l) => normalizeForCompare(l)),
  );

  const missing = imageLines.filter(
    (line) => !existing.has(normalizeForCompare(line)),
  );

  if (missing.length === 0) {
    continue;
  }

  // Skip MI-only flow diagrams in Ballerina-only guides.
  const ballerinaOnly =
    !current.includes('Micro Integrator') &&
    !current.includes('=== "Ballerina"');
  const filtered = ballerinaOnly
    ? missing.filter(
        (line) =>
          !/-flow-mi\.png|datamapper\.png|fhir-data-mapping-mi/i.test(line),
      )
    : missing;

  if (filtered.length === 0) {
    continue;
  }

  const block = `\n${filtered.join('\n\n')}\n`;
  current = `${current.trimEnd()}${block}\n`;
  fs.writeFileSync(currentPath, current);
  restored += 1;
  console.log(`restored ${filtered.length} image(s) in ${rel}`);
}

console.log(`Done. Updated ${restored} guide file(s).`);
