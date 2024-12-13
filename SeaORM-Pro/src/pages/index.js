import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import HomepageExample from '../components/HomepageExample';
import HomepageCompare from '../components/HomepageCompare';
import HomepageProducts from '../components/HomepageProducts';
import HomepageSponsors from '../components/HomepageSponsors';
import HomepageWaitingList from '../components/HomepageWaitingList';
import HomepageMascot from '../components/HomepageMascot';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img className={styles.homepageLogo} width="90%" src="/SeaORM-Pro/img/SeaORM logo.png" />
        <img className={styles.homepageBanner} width="90%" src="/SeaORM-Pro/img/SeaORM Pro banner.png" />
        <h2 className="hero__subtitle">{siteConfig.tagline}</h2>
        <br/>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/index">
            Documentation
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
        {/* <HomepageCompare /> */}
        {/* <HomepageProducts /> */}
        {/* <HomepageSponsors /> */}
        <HomepageWaitingList />
        <HomepageMascot />
      </main>
    </Layout>
  );
}
