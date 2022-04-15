const versions = require('./versions.json');

function getNextMinorVersionName() {
  const minorVersion = parseInt(versions[0].split('.')[1], 10);
  return `0.${minorVersion + 1}.x`;
}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaORM 🐚 An async & dynamic ORM for Rust',
  tagline: '🐚 SeaORM is a relational ORM to help you build web services in Rust with the familiarity of dynamic languages.',
  url: 'https://www.sea-ql.org',
  baseUrl: '/SeaORM/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'SeaQL',
  projectName: 'sea-orm',
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: 'img/SeaORM banner.png',
    metadata: [
      {name: 'keywords', content: 'rust, orm, SeaORM, database, sql, mysql, sqlite, postgresql, rocket, tokio, sqlx, actix, async-std'},
    ],
    navbar: {
      title: 'SeaORM',
      logo: {
        alt: 'SeaORM Logo',
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
          to: '/blog',
          label: 'Blog',
          position: 'left'
        },
        {
          href: 'https://crates.io/crates/sea-orm',
          label: 'Crate',
          position: 'right',
        },
        {
          href: 'https://github.com/SeaQL/sea-orm',
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
              to: '/docs/index',
            },
            {
              label: 'SeaORM Tutorials',
              to: 'https://www.sea-ql.org/sea-orm-tutorial/',
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
              href: 'https://github.com/SeaQL/sea-orm/discussions',
            },
            {
              label: 'Discord',
              href: 'https://discord.com/invite/uCPdDXzbdv',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/sea_ql',
            },
            {
              label: 'GSoC',
              href: 'https://summerofcode.withgoogle.com/programs/2022/organizations/seaql',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'About Us',
              to: '/about-us',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'StarfishQL',
              to: 'https://www.sea-ql.org/StarfishQL/',
            },
          ],
        },
      ],
      copyright: [
        `<br/><div style="display: flex; justify-content: center;"><a href="https://github.com/SeaQL/sea-orm/stargazers/" target="_blank"><img src="https://img.shields.io/github/stars/SeaQL/sea-orm.svg?style=social&label=Star&maxAge=1"/></a></div>`,
        `<br/>Copyright © ${new Date().getFullYear()} SeaQL`,
      ].join(''),
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: [
        'toml',
        'rust',
      ],
    },
    algolia: {
      appId: 'F60BRNGE7P',
      apiKey: 'cb0fff4f36dcd0f3d6a97e12e494dec7',
      indexName: 'seaorm',
      contextualSearch: true,
    },
    hideableSidebar: true,
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/SeaORM/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          versions: {
            current: {
              label: `${getNextMinorVersionName()} 🚧`,
            },
          },
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/SeaORM/',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          postsPerPage: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.8,
          trailingSlash: true,
        },
      },
    ],
  ],
  scripts: [
    '/sea-ql.js',
  ],
};
