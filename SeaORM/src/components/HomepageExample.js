import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';
import ExampleCodeBlock from '../pages/ExampleCodeBlock.mdx';

export default function HomepageCompare() {
  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
        <div className={clsx('col col--12')}>
            <div className="padding-horiz--md">
              <h2>Example</h2>
              <ExampleCodeBlock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
