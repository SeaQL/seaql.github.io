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
              With <Link to="/docs/graph-ql/seaography-intro/">Seaography</Link>, you can quickly launch a GraphQL server from SeaORM entities!
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
