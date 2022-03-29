import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageDemo from '../components/HomepageDemo';
import HomepageMascot from '../components/HomepageMascot';
import clsx from 'clsx';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img className={styles.homepageLogo} width="90%" src="/StarfishQL/img/SeaQL logo.png" />
        <img className={styles.homepageBanner} width="90%" src="/StarfishQL/img/SeaQL logo.png" />
        <h2 className={clsx("hero__subtitle", styles.tagline)}>StarfishQL is experimental graph database and query engine <br/>to enable graph analysis and visualization on the web.</h2>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/index">
            Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageDemo />
        <HomepageMascot />
      </main>
    </Layout>
  );
}
