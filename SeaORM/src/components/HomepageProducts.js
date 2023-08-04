import React from 'react';
import clsx from 'clsx';
import Slider from 'react-slick';
import styles from './HomepageProducts.module.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const ProductList = shuffle([
  {
    url: 'https://caido.io/',
    logo: '/SeaORM/img/other/caido-logo.png',
    desc: 'A lightweight web security auditing toolkit',
    logoClassName: null,
  },
  {
    url: 'https://codectrl.authentura.com/',
    logo: '/SeaORM/img/other/codectrl-logo.png',
    desc: 'A self-hostable code logging platform',
    logoClassName: styles.codectrlLogo,
  },
  {
    url: 'https://mydatamyconsent.com/',
    logo: '/SeaORM/img/other/mydatamyconsent-logo.png',
    desc: 'Online data sharing simplified',
    logoClassName: styles.mydatamyconsentLogo,
  },
  {
    url: 'https://prefix.dev/',
    logo: '/SeaORM/img/other/prefixdev-logo.png',
    desc: 'Rethinking Package Management',
    logoClassName: styles.prefixdevLogo,
  },
  {
    url: 'https://www.spyglass.fyi/',
    logo: '/SeaORM/img/other/spyglass-logo.svg',
    desc: 'A personal search engine',
    logoClassName: styles.spyglassLogo,
  },
  {
    url: 'https://www.svix.com/',
    logo: '/SeaORM/img/other/svix-logo.svg',
    desc: 'The enterprise ready webhooks service',
    logoClassName: styles.svixLogo,
  },
  {
    url: 'https://upvpn.app/',
    logo: '/SeaORM/img/other/upvpn-logo.png',
    desc: 'Serverless Pay as you go VPN',
    logoClassName: styles.upvpnLogo,
  },
]);

function Product({url, logo, desc, logoClassName}) {
  return (
    <div style={{ height: '180px' }}>
      <a href={url} target="_blank" className={clsx(styles.anchorNormalText)}>
        <div style={{
          paddingBottom: '20px',
          paddingTop: '20px',
          height: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={logo} className={clsx(logoClassName)} style={{ width: '250px' }}/>
          </div>
          <p style={{ margin: '0px', marginTop: '20px' }}>
            {desc}
          </p>
        </div>
      </a>
    </div>
  );
}

const settings = {
  dots: false,
  infinite: true,
  pauseOnHover: true,
  swipeToSlide: true,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  rows: 1,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 1680, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 650, settings: { slidesToShow: 1, slidesToScroll: 1, rows: 2 } },
  ]
};

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
            <Slider {...settings}>
              {ProductList.map((props, idx) => (
                <Product key={idx} {...props} />
              ))}
            </Slider>
          </div>
        </div>
        <br/>
        <div className="row">
          <div className="col col--12">
            <p className="text--center">
              For more projects, see <a href="https://github.com/SeaQL/sea-orm/blob/master/COMMUNITY.md#built-with-seaorm" target="_blank">Built with SeaORM</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
