import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageMascot from '../components/HomepageMascot';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img className={styles.homepageLogo} width="100%" src="/Seaography/img/Seaography.png" />
        <img className={styles.homepageBanner} width="380px" src="/Seaography/img/Seaography.png" />
        <h2 className="hero__subtitle">{siteConfig.tagline}</h2>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started">
            Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main style={{ margin: '5%' }}>
        <p>Seaography is a GraphQL framework for building GraphQL resolvers using SeaORM entities.
          It ships with a CLI tool that can generate ready-to-compile Rust GraphQL servers from existing
          MySQL, Postgres and SQLite databases.</p>

        <p><img src="img/playground_example_database.png" alt="Application preview" /></p>

        <h3>Benefits</h3>

        <ul>
          <li>Quick and easy to get started</li>
          <li>Generates readable code</li>
          <li>Extensible project structure</li>
          <li>Based on popular async libraries:&nbsp;
            <a href="https://github.com/async-graphql/async-graphql">async-graphql</a>&nbsp;
            and <a href="https://github.com/SeaQL/sea-orm">SeaORM</a></li>
        </ul>

        <h3>Features</h3>

        <ul>
          <li>Relational query (1-to-1, 1-to-N)</li>
          <li>Pagination on query's root entity</li>
          <li>Filter with operators (e.g. gt, lt, eq)</li>
          <li>Order by any column</li>
        </ul>
      </main>
    </Layout>
  );
}
