import React from 'react';
import clsx from 'clsx';
import styles from './HomepageStickerPack.module.css';

export default function render() {
  return (
    <section className={clsx('home-section', styles.features)}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--12')}>
            <h2 className="text--center">Express your passion for Rust</h2>
            <p className="text--center">
                The <a href="https://www.sea-ql.org/sticker-pack/" target="_blank">Rustacean Sticker Pack 🦀</a> are made with a premium water-resistant vinyl with a unique matte finish.
                <br/>
                All proceeds contributes directly to open-source development.
            </p>
            <div className="text--center padding-horiz--md">
            <a href="https://www.sea-ql.org/sticker-pack/" target="_blank">
                <img className={styles.sticker} src="https://www.sea-ql.org/static/sticker-pack-1s.jpg"/>
            </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
