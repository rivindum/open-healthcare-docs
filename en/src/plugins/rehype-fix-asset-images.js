/**
 * Rewrites <img> paths so assets load under Docusaurus baseUrl (e.g. GitHub Pages).
 * Relative paths like ../../../assets/img/... resolve incorrectly from /docs/... URLs.
 */

function normalizeAssetSrc(src) {
  if (!src || typeof src !== 'string') {
    return src;
  }

  const relativeMatch = src.match(/^(?:\.\.\/)+assets\/img\/(.+)$/);
  if (relativeMatch) {
    return `/assets/img/${relativeMatch[1]}`;
  }

  if (src.startsWith('assets/img/')) {
    return `/${src}`;
  }

  return src;
}

function withBaseUrl(src, baseUrl) {
  const normalized = normalizeAssetSrc(src);
  if (!normalized?.startsWith('/assets/')) {
    return normalized;
  }
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${prefix}${normalized.slice(1)}`;
}

function walkElements(node, visitor) {
  if (!node || typeof node !== 'object') {
    return;
  }
  if (node.type === 'element') {
    visitor(node);
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walkElements(child, visitor);
      }
    }
  } else if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walkElements(child, visitor);
    }
  }
}

function rehypeFixAssetImages({baseUrl = '/'}) {
  return (tree) => {
    walkElements(tree, (node) => {
      if (node.tagName !== 'img' || !node.properties?.src) {
        return;
      }
      node.properties.src = withBaseUrl(String(node.properties.src), baseUrl);
    });
  };
}

module.exports = rehypeFixAssetImages;
