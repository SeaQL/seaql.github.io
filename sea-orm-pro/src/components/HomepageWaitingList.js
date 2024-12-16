import React from 'react';
import clsx from 'clsx';
import styles from './HomepageWaitingList.module.css';
import Link from '@docusaurus/Link';

export default function render() {
  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--12')}>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="https://forms.office.com/r/gWk7CU9yjV">
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
