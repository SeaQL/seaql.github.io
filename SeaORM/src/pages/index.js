import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import HomepageExample from '../components/HomepageExample';
import HomepageSeaography from '../components/HomepageSeaography';
import HomepageSeaOrmPro from '../components/HomepageSeaOrmPro';
import HomepageProducts from '../components/HomepageProducts';
import HomepageSponsors from '../components/HomepageSponsors';
import HomepageMascot from '../components/HomepageMascot';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img className={styles.homepageLogo} width="90%" src="/SeaORM/img/SeaORM logo.png" />
        <img className={styles.homepageBanner} width="90%" src="/SeaORM/img/SeaORM banner.png" />
        <h2 className="hero__subtitle">{siteConfig.tagline}</h2>
        <br/>
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
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageExample />
        <HomepageSeaography />
        <HomepageSeaOrmPro />
        <HomepageProducts />
        <HomepageSponsors />
        <HomepageMascot />
      </main>
    </Layout>
  );
}
