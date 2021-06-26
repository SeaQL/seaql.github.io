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
              <p style={{whiteSpace: 'pre'}}>
                <br /> Diesel          SeaORM
                <br /> =====           =====
                <br /> Sync            Async
                <br /> Static          Dynamic
                <br /> Native Driver   Pure Rust
                <br /> =====================
                <br />     Relational
                <br />     Schema first
                <br />     With Cli tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
