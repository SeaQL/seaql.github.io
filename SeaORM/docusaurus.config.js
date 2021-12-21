const versions = require('./versions.json');

function getNextMinorVersionName() {
  const minorVersion = parseInt(versions[0].split('.')[1], 10);
  return `0.${minorVersion + 1}.x`;
}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaORM - 🐚 An async & dynamic ORM for Rust',
  tagline: '🐚 An async & dynamic ORM for Rust',
  url: 'https://www.sea-ql.org/',
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
          ],
        },
      ],
      copyright: `<br/>Copyright © ${new Date().getFullYear()} SeaQL<br/>Built with 🔥 by 🌊🦀🐚`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: [
        'toml',
        'rust',
      ],
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
        },
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
