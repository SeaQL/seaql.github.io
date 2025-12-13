/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaQL',
  tagline: 'Building Developer Tools for Rust',
  url: 'https://www.sea-ql.org',
  baseUrl: '/interview/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'SeaQL',
  projectName: 'sea-ql-interview',
  trailingSlash: true,
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: 'img/SeaQL logo.png',
    metadata: [
      {name: 'keywords', content: 'rust, orm, SeaORM, SeaQuery, SeaSchema, Seaography, StarfishQL, database, sql, mysql, sqlite, postgresql, rocket, tokio, sqlx, actix, async-std'},
    ],
    navbar: {
      title: 'SeaQL',
      logo: {
        alt: 'SeaQL Logo',
        src: 'img/SeaQL.png',
        href: 'https://www.sea-ql.org',
        target: '_self',
      },
      items: [
        {
          to: 'https://www.sea-ql.org/interview/',
          target: '_self',
          label: 'Interview',
          position: 'left'
        },
        {
          to: 'https://www.sea-ql.org/blog/',
          target: '_self',
          label: 'Blog',
          position: 'left'
        },
        {
          to: 'https://github.com/SeaQL',
          target: '_blank',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/SeaQL',
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
              label: 'LinkedIn',
              to: 'https://www.linkedin.com/company/sea-ql',
            },
          ],
        },
        {
          title: 'Projects',
          items: [
            {
              label: 'SeaORM',
              to: 'https://www.sea-ql.org/SeaORM/',
            },
            {
              label: 'SeaQuery',
              to: 'https://github.com/SeaQL/sea-query',
            },
            {
              label: 'Seaography',
              to: 'https://www.sea-ql.org/Seaography/',
            },
          ],
        },
      ],
      copyright: [
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
    // algolia: {
    //   appId: 'SLLZ32J41K',
    //   apiKey: 'c115bc77747b9ab31b84d01c1c5c1a0a',
    //   indexName: 'sea-ql',
    //   contextualSearch: true,
    // },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/Interview/',
          blogTitle: 'Interview',
          blogDescription: 'SeaQL Interviews',
          blogSidebarTitle: 'All Interviews',
          blogSidebarCount: 'ALL',
          postsPerPage: 12,
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
  plugins: [
    'plugin-image-zoom'
  ],
};
