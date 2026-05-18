import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Healthcare Solution Documentation',
  tagline: 'Documentation for WSO2 Open Healthcare Accelerator',
  favicon: 'img/favicon.svg',
  url: 'https://oh.docs.wso2.com',
  baseUrl: process.env.BASE_URL || '/',
  organizationName: 'wso2',
  projectName: 'open-healthcare-docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themes: [],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wso2/open-healthcare-docs/edit/main/en/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  stylesheets: [
    '/assets/css/ohtheme.css',
    '/assets/css/blue-palette-alt1.css',
    '/assets/css/config-catalog.css',
    '/assets/css/redoc.css',
    '/assets/lib/highlightjs/styles/vs.min.css',
    '/assets/lib/json-formatter/json-formatter.css',
    '/assets/lib/fontawesome-free-6.3.0-web/css/all.min.css',
  ],
  scripts: [
    '/assets/lib/highlightjs/highlight.min.js',
    '/assets/lib/json-formatter/json-formatter.umd.js',
    '/assets/js/ohtheme.js',
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
        {
          title: 'Learn',
          items: [
            { label: 'FHIR', to: '/docs/fhir/guides/overview-of-fhir' },
            { label: 'HL7', to: '/docs/hl7/guides/overview' },
            { label: 'Data transformation', to: '/docs/data-transformation/guides/hl7v2-fhir' },
          ],
        },
        {
          title: 'Advanced',
          items: [
            { label: 'EMR Connectivity', to: '/docs/emr-connectivity/guides/emr-systems-overview' },
            { label: 'Secure Health APIs', to: '/docs/secure-health-apis/guides/smart-on-fhir-overview' },
            { label: 'Advanced Topics', to: '/docs/advance-topics/guides/enable-workflow' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WSO2 LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
