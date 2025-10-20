import React from 'react';
import clsx from 'clsx';
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
            to="/docs/index">
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
      <main>
        <div className="container">
          <div className="row">
            <div className={clsx('col col--12')}>
              <video width="100%" autoplay muted playsInline controls>
                <source src="https://www.sea-ql.org/blog/img/Seaography%20Demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h3>In under a minute, we've done the following:</h3>
              <ol>
                <li>Generate SeaORM entities from an existing sakila database</li>
                <li>Generate a GraphQL web server around the entities</li>
                <li>Launch it and run some queries with GraphQL playground</li>
              </ol>
              <p>The generated framework is fully customizable!</p>
            </div>
          </div>
          <div className="row">
            <div className={clsx('col col--12')}>
              <h3>Seaography is a GraphQL framework that offers:</h3>
              <ul>
                <li>Automatic GraphQL resolver generation with data loader integration to solve the N+1 problem</li>
                <li>Extensive customization options and the ability to add custom endpoints easily</li>
                <li>Authorization: Role-Based Access Control (RBAC) and fine-grained control with hooks / guards</li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className={clsx('col col--12')}>
              <p></p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
