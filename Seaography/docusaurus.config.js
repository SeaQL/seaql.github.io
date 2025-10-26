const versions = require('./versions.json');

function getNextMinorVersionName() {
  let majorVersion = 2;
  let minorVersion = 0;
  return `${majorVersion}.${minorVersion}.x`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Seaography 🧭 A GraphQL framework for Rust',
  tagline: '🧭 Seaography is a GraphQL framework for Rust',
  url: 'https://www.sea-ql.org',
  baseUrl: '/Seaography/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SeaQL', // Usually your GitHub org/user name.
  projectName: 'seaography', // Usually your repo name.
  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/Seaography/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          lastVersion: 'current',
          versions: {
            current: {
              label: `${getNextMinorVersionName()}`,
              path: '',
            },
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.8,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Seaography',
        logo: {
          alt: 'Seaography Logo',
          src: 'img/SeaQL.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Docs',
          },
          {
            to: 'https://www.sea-ql.org/blog/',
            target: '_self',
            label: 'Blog',
            position: 'left'
          },
          {
            href: 'https://crates.io/crates/seaography',
            label: 'Crate',
            position: 'right',
          },
          {
            href: 'https://github.com/SeaQL/seaography',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/index',
              },
              {
                label: 'API Reference',
                to: 'https://docs.rs/seaography/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/SeaQL/seaography/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/uCPdDXzbdv',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/sea_ql',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'About Us',
                to: 'https://www.sea-ql.org/about-us/',
                target: '_self',
              },
              {
                label: 'Blog',
                to: 'https://www.sea-ql.org/blog/',
                target: '_self',
              },
            ],
          },
        ],
        copyright: [
          `<br/><a href="https://github.com/SeaQL/seaography/stargazers/" target="_blank"><img src="https://img.shields.io/github/stars/SeaQL/seaography.svg?style=social&label=Star"/></a>`,
          '<br/>Every ⭐ counts!',
          `<br/>SeaQL.org © ${new Date().getFullYear()} 🇬🇧`,
        ].join(''),
      },
      prism: {
        // Themes: https://github.com/FormidableLabs/prism-react-renderer/tree/master/packages/prism-react-renderer/src/themes
        theme: require('prism-react-renderer').themes.vsLight,
        darkTheme: require('prism-react-renderer').themes.vsDark,
        additionalLanguages: [
          'toml',
          'rust',
          'bash',
        ],
      },
      algolia: {
        appId: 'EUI01QE7ZT',
        apiKey: '54027efc0b5f84970278ec0e3f8f434a',
        indexName: 'seaography',
        contextualSearch: true,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
    }),
  stylesheets: [
    '/cookieconsent/cookieconsent.css',
  ],
  scripts: [
    '/sea-ql.js',
    {
      type: 'module',
      src: '/cookieconsent/cookieconsent.js',
      async: true,
    },
  ],
};

module.exports = config;
