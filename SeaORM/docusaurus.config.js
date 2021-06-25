const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaORM',
  tagline: '🐚 An async & dynamic ORM for Rust',
  url: 'https://www.sea-ql.org/',
  baseUrl: '/SeaORM/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'SeaQL',
  projectName: 'sea-orm',
  themeConfig: {
    navbar: {
      title: 'SeaORM',
      logo: {
        alt: 'SeaORM Logo',
        src: 'img/SeaQL.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        // {
        //   to: '/blog',
        //   label: 'Blog',
        //   position: 'left'
        // },
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
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Installation & Configuration',
              to: '/docs/install-and-config/database-and-async-runtime',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/SeaQL/sea-orm',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SeaQL. Built with 🔥 by 🌊🦀🐚`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
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
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/SeaORM/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
