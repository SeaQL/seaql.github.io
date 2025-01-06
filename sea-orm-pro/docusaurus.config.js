const tailwindPlugin = require('./plugins/tailwind-config.cjs');

module.exports = {
  title: 'SeaORM Pro 🐚 An admin dashboard built on top of SeaORM & Seaography',
  tagline: '🐚 SeaORM Pro is an admin dashboard built on top of SeaORM & Seaography',
  url: 'https://www.sea-ql.org',
  baseUrl: '/sea-orm-pro/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'SeaQL',
  projectName: 'sea-orm-x',
  trailingSlash: true,
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: 'img/SeaORM Pro banner.png',
    metadata: [
      {name: 'keywords', content: 'rust, orm, SeaORM Pro, database, sql, mysql, sqlite, postgresql, rocket, tokio, sqlx, actix, async-std'},
    ],
    navbar: {
      title: 'SeaORM Pro',
      logo: {
        alt: 'SeaORM Pro Logo',
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
          to: 'https://crates.io/crates/sea-orm-pro',
          label: 'Crate',
          position: 'right',
        },
        {
          to: 'https://github.com/SeaQL/sea-orm-pro',
          label: 'GitHub',
          position: 'right',
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
              to: '/docs/index',
            },
            {
              label: 'API Reference',
              to: 'https://docs.rs/sea-orm-pro/latest/sea_orm_pro/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/SeaQL/sea-orm-pro/discussions',
            },
            {
              label: 'Discord',
              to: 'https://discord.com/invite/uCPdDXzbdv',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/sea_ql',
            },
            {
              label: 'GSoC',
              to: 'https://summerofcode.withgoogle.com/programs/2022/organizations/seaql',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              target: '_self',
              to: 'https://www.sea-ql.org/blog/',
            },
            {
              label: 'About Us',
              to: '/about-us',
            },
          ],
        },
      ],
      copyright: [
        `<br/><a href="https://github.com/SeaQL/sea-orm/stargazers/" target="_blank"><img src="https://img.shields.io/github/stars/SeaQL/sea-orm.svg?style=social&label=Star"/></a>`,
        '<br/>Every ⭐ counts!',
        `<br/>Copyright © ${new Date().getFullYear()} SeaQL.org`,
      ].join(''),
    },
    prism: {
      // Themes: https://github.com/FormidableLabs/prism-react-renderer/tree/master/packages/prism-react-renderer/src/themes
      theme: require('prism-react-renderer/themes/vsLight'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
      additionalLanguages: [
        'toml',
        'rust',
        'bash',
      ],
    },
    // algolia: {
    //   appId: 'F60BRNGE7P',
    //   apiKey: 'cb0fff4f36dcd0f3d6a97e12e494dec7',
    //   indexName: 'seaorm',
    //   contextualSearch: true,
    // },
    announcementBar: {
      id: 'sea-orm-bar',
      content: '🚧 &nbsp; SeaORM Pro is in closed beta! &nbsp; 🚧',
      isCloseable: false,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/sea-orm-pro/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.8,
        },
      },
    ],
  ],
  scripts: [
    '/sea-ql.js',
  ],
  plugins: [
    tailwindPlugin,
  ],
};
