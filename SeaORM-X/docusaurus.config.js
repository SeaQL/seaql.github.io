/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaORM X 🐚 An async & dynamic ORM built on top of SeaORM with support for SQL Server',
  tagline: '🐚 SeaORM X is built on top of SeaORM with support for SQL Server',
  url: 'https://www.sea-ql.org',
  baseUrl: '/SeaORM-X/',
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
    image: 'img/SeaORM X banner.png',
    metadata: [
      {name: 'keywords', content: 'rust, orm, SeaORM X, database, sql, mysql, sqlite, postgresql, rocket, tokio, sqlx, actix, async-std'},
    ],
    navbar: {
      title: 'SeaORM X',
      logo: {
        alt: 'SeaORM X Logo',
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
          to: 'https://www.sea-ql.org/sea-orm-tutorial/',
          label: 'Tutorial',
          position: 'left',
        },
        {
          to: 'https://www.sea-ql.org/sea-orm-cookbook/',
          label: 'Cookbook',
          position: 'left',
        },
        {
          to: 'https://crates.io/crates/sea-orm',
          label: 'Crate',
          position: 'right',
        },
        {
          to: 'https://github.com/SeaQL/sea-orm',
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
              label: 'SeaORM Tutorial',
              to: 'https://www.sea-ql.org/sea-orm-tutorial/',
            },
            {
              label: 'SeaORM Cookbook',
              to: 'https://www.sea-ql.org/sea-orm-cookbook/',
            },
            {
              label: 'API Reference',
              to: 'https://docs.rs/sea-orm/latest/sea_orm/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/SeaQL/sea-orm/discussions',
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
            {
              label: 'Seaography',
              to: 'https://www.sea-ql.org/Seaography/',
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
      content: '🚧 &nbsp; SeaORM X is in closed beta! &nbsp; If you are interested, please join our <a href="https://forms.office.com/r/1MuRPJmYBR" target="_blank">waiting list</a>. &nbsp; 🚧',
      isCloseable: false,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/SeaORM-X/',
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
};
