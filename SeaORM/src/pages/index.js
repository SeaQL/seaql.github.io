import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import HomepageCompare from '../components/HomepageCompare';
import HomepageExample from '../components/HomepageExample';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <style>{`
      @media only screen and (max-width: 480px) {
        #homepageBanner {
          display: none;
        }
      }
      @media only screen and (min-width: 481px) {
        #homepageLogo {
          display: none;
        }
      }
      `}</style>
      <div className="container">
        <img id="homepageLogo" width="90%" src="/SeaORM/img/SeaORM logo.png" />
        <img id="homepageBanner" width="90%" src="/SeaORM/img/SeaORM banner.png" />
        <p className="hero__subtitle">SeaORM is an async & dynamic relational ORM<br/>to help you build light weight and concurrent web services<br/>in Rust.</p>
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
      description="🐚 An async & dynamic ORM for Rust">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageCompare />
        <HomepageExample />
      </main>
    </Layout>
  );
}
