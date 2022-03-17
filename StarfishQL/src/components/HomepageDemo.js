import React from 'react';
import clsx from 'clsx';
import styles from './HomepageDemo.module.css';

export default function HomepageFeatures() {
  return (
    <section className={clsx('home-section', 'home-section-alt')}>
      <div className="container">
        <h2 className={clsx('text--center')}>Visualization of crates.io Dependency Network</h2>
        <div className="row">
          <div className="col col--10 col--offset-1">
            <div className="row">
              <div className={clsx('col col--6', styles.demoColMargin)}>
                <div class="card">
                  <div class="card__image">
                    <img src="https://placekitten.com/640/400" />
                  </div>
                  <div class="card__body">
                    <h2 className={clsx('text--center')}>
                      Top-N Dependencies
                    </h2>
                    <p>
                      e.g. To query the graph starting from the 10 most popular crates
                    </p>
                  </div>
                  <div class="card__footer">
                    <a class="button button--outline button--primary button--block" href="/StarfishQL/demo">
                      Try Interactive Demo
                    </a>
                  </div>
                </div>
              </div>
              <div className={clsx('col col--6', styles.demoColMargin)}>
                <div class="card">
                  <div class="card__image">
                    <img src="https://placekitten.com/640/400" />
                  </div>
                  <div class="card__body">
                    <h2 className={clsx('text--center')}>
                      Dependencies & Dependants Graph
                    </h2>
                    <p>
                      e.g. To query a crate id=888 with all its dependents (reverse of dependency)
                    </p>
                  </div>
                  <div class="card__footer">
                    <a class="button button--outline button--primary button--block" href="/StarfishQL/demo">
                      Try Interactive Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
