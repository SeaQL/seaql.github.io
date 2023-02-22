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
          <div className={styles.tableFlexBox}>
            <table className={styles.table}>
              <tr>
                <th width="50%">SeaORM</th>
                <th width="50%">Diesel</th>
              </tr>
              <tr>
                <td>Async</td>
                <td>Sync</td>
              </tr>
              <tr>
                <td>Dynamic</td>
                <td>Static</td>
              </tr>
              <tr>
                <td>Pure Rust</td>
                <td>Native Driver</td>
              </tr>
              <tr>
                <td colSpan="2">Relational</td>
              </tr>
              <tr>
                <td colSpan="2">Schema First</td>
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
