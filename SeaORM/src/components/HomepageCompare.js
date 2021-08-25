import React from 'react';
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';

export default function HomepageCompare() {
  return (
    <section className={clsx('home-section', styles.features)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--12')}>
            <div className="text--center padding-horiz--md">
              <h2>Comparison with Diesel</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className={clsx('col col--6 col--offset-5')}>
            <table className={styles.table}>
              <tr>
                <th>Diesel</th>
                <th>SeaORM</th>
              </tr>
              <tr>
                <td>Sync</td>
                <td>Async</td>
              </tr>
              <tr>
                <td>Static</td>
                <td>Dynamic</td>
              </tr>
              <tr>
                <td>Native Driver</td>
                <td>Pure Rust</td>
              </tr>
              <tr>
                <td colSpan="2">Relational</td>
              </tr>
              <tr>
                <td colSpan="2">Schema first</td>
              </tr>
              <tr>
                <td colSpan="2">MySQL / Postgres / SQLite</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
