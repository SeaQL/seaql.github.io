import React from 'react';
import clsx from 'clsx';
import styles from './HomepageDemo.module.css';

const DEMO_BASE_URL = 'https://starfish-ql.sea-ql.org';

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
                    <img src="/StarfishQL/img/graph.png" />
                  </div>
                  <div class="card__body">
                    <h2 className={clsx('text--center')}>
                      Top-N Dependencies
                    </h2>
                    <p>
                      Traverse the graph in the normal direction starting from the N most connected nodes.
                    </p>
                  </div>
                  <div class="card__footer">
                    <a class="button button--outline button--primary button--block" href={`${DEMO_BASE_URL}/graph`} target="_blank">
                      Try Interactive Demo
                    </a>
                  </div>
                </div>
              </div>
              <div className={clsx('col col--6', styles.demoColMargin)}>
                <div class="card">
                  <div class="card__image">
                    <img src="/StarfishQL/img/tree.png" />
                  </div>
                  <div class="card__body">
                    <h2 className={clsx('text--center')}>
                      Dependencies & Dependents
                    </h2>
                    <p>
                      Traverse the graph in both the normal and reversed directions starting from a root node.
                    </p>
                  </div>
                  <div class="card__footer">
                    <a class="button button--outline button--primary button--block" href={`${DEMO_BASE_URL}/tree`} target="_blank">
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
