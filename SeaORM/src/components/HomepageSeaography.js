import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageSeaography.module.css';

export default function render() {
  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--12')}>
            <h2 className="text--center">SeaORM ➕ GraphQL = 🧭 Seaography</h2>
            <p className="text--center">
              With <a href="https://www.sea-ql.org/Seaography/">Seaography</a>, you can instantly launch a fully-fledged GraphQL server!
            </p>
            <div className="text--center padding-horiz--md">
              <img className={styles.seaography} src="/SeaORM/img/Seaography Screenshot.png"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
