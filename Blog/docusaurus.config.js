/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SeaQL - Building data intensive applications in Rust',
  tagline: 'We help developers in building data intensive applications in Rust, whether they are web services (GraphQL, gRPC, REST), command line tools or apps.',
  url: 'https://www.sea-ql.org',
  baseUrl: '/blog/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'SeaQL',
  projectName: 'sea-ql-blog',
  trailingSlash: true,
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: 'img/SeaQL logo.png',
    metadata: [
      {name: 'keywords', content: 'rust, orm, SeaORM, SeaQuery, SeaSchema, StarfishQL, database, sql, mysql, sqlite, postgresql, rocket, tokio, sqlx, actix, async-std'},
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
          to: '/blog',
          label: 'Blog',
          position: 'left'
        },
        {
          to: 'https://github.com/SeaQL',
          label: 'GitHub',
          position: 'left',
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
            {
              label: 'DEV',
              to: 'https://dev.to/seaql',
            },
            {
              label: 'GSoC',
              to: 'https://summerofcode.withgoogle.com/programs/2022/organizations/seaql',
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
              label: 'SeaSchema',
              to: 'https://github.com/SeaQL/sea-schema',
            },
            {
              label: 'StarfishQL',
              to: 'https://www.sea-ql.org/StarfishQL/',
            },
            {
              label: 'Seaography',
              to: 'https://www.sea-ql.org/Seaography/',
            },
          ],
        },
      ],
      copyright: [
        `<br/>Copyright © ${new Date().getFullYear()} SeaQL`,
      ].join(''),
    },
    prism: {
      additionalLanguages: [
        'toml',
        'rust',
      ],
    },
    algolia: {
      appId: 'SLLZ32J41K',
      apiKey: 'c115bc77747b9ab31b84d01c1c5c1a0a',
      indexName: 'sea-ql',
      contextualSearch: true,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          editUrl: 'https://github.com/SeaQL/seaql.github.io/edit/master/Blog/',
          blogSidebarTitle: 'All Posts',
          blogSidebarCount: 'ALL',
          postsPerPage: 'ALL',
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
