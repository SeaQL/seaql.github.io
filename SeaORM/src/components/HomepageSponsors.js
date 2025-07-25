import React from 'react';
import clsx from 'clsx';
import Slider from 'react-slick';
import styles from './HomepageProducts.module.css';
import { useColorMode } from '@docusaurus/theme-common';

export default function HomepageProducts() {
  const { colorMode } = useColorMode();

  return (
    <section id="our-users" className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <h2 className="text--center">Gold Sponsors</h2>
        <div className="row">
          <div className="col col--12">
            <div className="row">
              <div className="col col--4"></div>
              <div className="col col--4">
                <p className="text--center">
                  <a href="https://qdx.co/" target="_blank">
                    <img src="https://www.sea-ql.org/static/sponsors/QDX.svg" width="180" />
                  </a>
                </p>
              </div>
              <div className="col col--4"></div>
            </div>
          </div>
        </div>
        <br />
        <h2 className="text--center">Silver Sponsors</h2>
        <p className="text--center">We’re immensely grateful to our sponsors: Digital Ocean, for sponsoring our servers. And JetBrains, for sponsoring our IDE.</p>
        <div className="row">
          <div className="col col--12">
            <div className="row">
              <div className="col col--2"></div>
              <div className="col col--2"></div>
              <div className="col col--2">
                <p className="text--center">
                  <a href="https://www.digitalocean.com/" target="_blank">
                    <img src="https://www.sea-ql.org/static/sponsors/DigitalOcean.svg" width="192" />
                  </a>
                </p>
              </div>
              <div className="col col--2">
                <p className="text--center">
                  <a href="https://www.jetbrains.com/" target="_blank">
                    <img src="https://www.sea-ql.org/static/sponsors/JetBrains.svg" width="192" />
                  </a>
                </p>
              </div>
              <div className="col col--2"></div>
              <div className="col col--2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
