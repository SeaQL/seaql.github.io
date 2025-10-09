import React from 'react';
import clsx from 'clsx';
import styles from './HomepageSeaOrmPro.module.css';

export default function render() {
  return (
    <section className={clsx('home-section', styles.features)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--12')}>
            <h2 className="text--center">SeaORM ➕ React = 🖥️ SeaORM Pro </h2>
            <p className="text--center">
              With <a href="https://www.sea-ql.org/sea-orm-pro/">SeaORM Pro</a>, you can easily launch an admin panel for your application, frontend development skills not required!
            </p>
            <div className="text--center padding-horiz--md">
              <a href="https://www.sea-ql.org/sea-orm-pro/">
                <img className={styles.sea_orm_pro_img} src="https://www.sea-ql.org/sea-orm-pro/img/01_banner.png#light" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
