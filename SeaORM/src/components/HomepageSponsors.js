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
        <div className="row">
          <div className="col col--12">
              <h2 className="text--center">Our Sponsors</h2>
              <br/>
              <p className="text--center">
                If you feel generous, a small donation via GitHub Sponsor will be greatly appreciated,
                <br/>and goes a long way towards sustaining the organization.
              </p>
          </div>
        </div>
        <br />
        <h3 className="text--center">Gold Sponsors</h3>
        <div className="row">
          <div className="col col--12">
            <div className="row">
              <div className="col col--4"></div>
              <div className="col col--4">
                <p className="text--center">
                  <a href="https://www.osmos.io/" target="_blank">
                    <img src={colorMode == 'dark' ? 'https://www.sea-ql.org/static/sponsors/Osmos-dark.svg' : 'https://www.sea-ql.org/static/sponsors/Osmos.svg'} width="238" />
                  </a>
                </p>
              </div>
              <div className="col col--4"></div>
            </div>
          </div>
        </div>
        <br />
        <h3 className="text--center">Sponsors</h3>
        <div className="row">
          <div className="col col--12">
            <div className="row">
              <div className="col col--2"></div>
              <div className="col col--2"></div>
              <div className="col col--2">
                <p className="text--center">
                  <a href="https://www.digitalocean.com/" target="_blank">
                    <img src="https://www.sea-ql.org/static/sponsors/DigitalOcean.svg" width="160" />
                  </a>
                </p>
              </div>
              <div className="col col--2">
                <p className="text--center">
                  <a href="https://www.jetbrains.com/" target="_blank">
                    <img src="https://www.sea-ql.org/static/sponsors/JetBrains.svg" width="160" />
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
