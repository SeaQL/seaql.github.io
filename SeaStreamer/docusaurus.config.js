const versions = require('./versions.json');

function getNextMinorVersionName() {
  const minorVersion = parseInt(versions[0].split('.')[1], 10);
  return `0.${minorVersion + 1}.x`;
}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaStreamer 🌊 A real-time stream processing toolkit for Rust',
  tagline: '🌊 SeaStreamer is a stream processing toolkit to help you build stream processors in Rust',
  url: 'https://www.sea-ql.org',
  baseUrl: '/SeaStreamer/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'SeaQL',
  projectName: 'sea-streamer',
  trailingSlash: true,
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: 'img/SeaStreamer banner.png',
    navbar: {
      title: 'SeaStreamer',
      logo: {
        alt: 'SeaStreamer Logo',
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
          to: 'https://crates.io/crates/sea-streamer',
          label: 'Crate',
          position: 'right',
        },
        {
          to: 'https://github.com/SeaQL/sea-streamer',
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
              to: 'https://docs.rs/sea-streamer/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/SeaQL/sea-streamer/discussions',
            },
            {
              label: 'Discord',
              to: 'https://discord.com/invite/uCPdDXzbdv',
            },
            {
              label: 'Twitter',
              to: 'https://twitter.com/sea_ql',
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
              to: 'https://www.sea-ql.org/about-us',
            }
          ],
        },
      ],
      copyright: [
        `<br/><a href="https://github.com/SeaQL/sea-streamer/stargazers/" target="_blank"><img src="https://img.shields.io/github/stars/SeaQL/sea-streamer.svg?style=social&label=Star"/></a>`,
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
      ],
    },
    // algolia: {
    //   appId: 'F60BRNGE7P',
    //   apiKey: 'cb0fff4f36dcd0f3d6a97e12e494dec7',
    //   indexName: 'seaorm',
    //   contextualSearch: true,
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/SeaStreamer/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          versions: {
            current: {
              label: `${getNextMinorVersionName()} 🚧`,
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
      },
    ],
  ],
  scripts: [
    '/sea-ql.js',
  ],
};
