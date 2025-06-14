// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const versions = require('./versions.json');

function getNextMinorVersionName() {
  const minorVersion = parseInt(versions[0].split('.')[1], 10);
  return `0.${minorVersion + 1}.x`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Seaography 🧭 A GraphQL framework and code generator for SeaORM',
  tagline: '🧭 Seaography is a GraphQL framework and code generator for SeaORM',
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
          versions: {
            current: {
              label: `${getNextMinorVersionName()} 🚧`,
            },
          },
        },
        // blog: {
          // showReadingTime: true,
          // // Please change this to your repo.
          // // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
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
            docId: 'getting-started',
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
                label: 'Getting Started',
                to: '/docs/getting-started',
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
          `<br/><div style="display: flex; justify-content: center;"><a href="https://github.com/SeaQL/seaography/stargazers/" target="_blank"><img src="https://img.shields.io/github/stars/SeaQL/seaography.svg?style=social&label=Star&maxAge=1"/></a></div>`,
          `<br/>SeaQL.org © ${new Date().getFullYear()} 🇬🇧`,
          `<br/>Built with 🔥 by 🌊🦀🐚`,
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
    scripts: [
      '/sea-ql.js',
    ],
};

module.exports = config;
