import React from 'react';
import clsx from 'clsx';
import styles from './HomepageProducts.module.css';

const ProductList = [
  {
    url: 'https://caido.io/',
    logo: '/SeaORM/img/other/caido-logo.png',
    desc: 'A lightweight web security auditing toolkit',
    logoClassName: null,
  },
  {
    url: 'https://l2.technology/sensei',
    logo: '/SeaORM/img/other/sensei-logo.svg',
    desc: 'A Bitcoin lightning node implementation',
    logoClassName: styles.senseiLogo,
  },
  {
    url: 'https://www.svix.com/',
    logo: '/SeaORM/img/other/svix-logo.svg',
    desc: 'The enterprise ready webhooks service',
    logoClassName: styles.svixLogo,
  },
];

function Product({url, logo, desc, logoClassName}) {
  return (
    <div className={clsx('col col--4')}>
      <div style={{
        paddingBottom: '20px',
        paddingTop: '20px',
        height: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <a href={url} target="_blank">
          <img src={logo} className={clsx(logoClassName)} style={{ width: '250px' }}/>
        </a>
        <p>{desc}</p>
      </div>
    </div>
  );
}

export default function HomepageProducts() {
  return (
    <section className={clsx('home-section', styles.features)}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
              <h2 className="text--center">Who's using SeaORM?</h2>
              <br/>
              <p className="text--center">
                The following products are powered by SeaORM:
              </p>
          </div>
        </div>
        <div className="row">
          <div className="col col--12">
            <div className="row">
              {ProductList.map((props, idx) => (
                <Product key={idx} {...props} />
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col--12">
            <br/>
            <p className="text--center">
              For more projects, see <a href="https://github.com/SeaQL/sea-orm/blob/master/COMMUNITY.md#built-with-seaorm" target="_blank">Built with SeaORM</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
