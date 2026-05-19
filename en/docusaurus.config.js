const { themes: prismThemes } = require('prism-react-renderer');
const rehypeFixAssetImages = require('./src/plugins/rehype-fix-asset-images');

const baseUrl = process.env.BASE_URL || '/';

/** Prefix absolute static asset paths with baseUrl (required for GitHub Pages project sites). */
function staticAsset(path) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Healthcare Solution Documentation',
  tagline: 'Documentation for WSO2 Open Healthcare Accelerator',
  favicon: 'img/favicon.svg',
  url: 'https://oh.docs.wso2.com',
  baseUrl,
  organizationName: 'wso2',
  projectName: 'open-healthcare-docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/wso2/open-healthcare-docs/edit/main/en/',
          showLastUpdateTime: true,
          rehypePlugins: [[rehypeFixAssetImages, {baseUrl}]],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  stylesheets: [
    staticAsset('/assets/css/ohtheme.css'),
    staticAsset('/assets/css/blue-palette-alt1.css'),
    staticAsset('/assets/css/config-catalog.css'),
    staticAsset('/assets/css/redoc.css'),
    staticAsset('/assets/lib/json-formatter/json-formatter.css'),
    staticAsset('/assets/lib/fontawesome-free-6.3.0-web/css/all.min.css'),
  ],
  scripts: [
    staticAsset('/assets/lib/json-formatter/json-formatter.umd.js'),
    staticAsset('/assets/js/ohtheme.js'),
  ],
  themeConfig: {
    image: 'img/logo.svg',
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'WSO2 Open Healthcare',
      logo: {
        alt: 'WSO2 Open Healthcare Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        { to: '/docs/get-started/introduction', label: 'Get started', position: 'left' },
        { to: '/docs/install-and-setup/manual', label: 'Install and setup', position: 'left' },
        { to: '/docs/fhir/guides/overview-of-fhir', label: 'FHIR', position: 'left' },
        { to: '/docs/hl7/guides/overview', label: 'HL7', position: 'left' },
        { to: '/docs/data-transformation/guides/hl7v2-fhir', label: 'Data transformation', position: 'left' },
        { href: 'https://github.com/wso2/open-healthcare-docs', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get started',
          items: [
            { label: 'Introduction', to: '/docs/get-started/introduction' },
            { label: 'Architecture', to: '/docs/get-started/architecture' },
            { label: 'Manual installation', to: '/docs/install-and-setup/manual' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WSO2 LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'json', 'yaml', 'markup', 'toml'],
    },
  },
};

module.exports = config;
