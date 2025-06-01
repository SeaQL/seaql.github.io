import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { MdCloud, MdCheckCircle, MdFlashOn, MdFlight } from "react-icons/md";

const FeatureList = [
  {
    title: 'Async',
    icon: <MdFlashOn size={26} />,
    description: (
      <>
        Relying on SQLx, SeaORM is a new library with async support from day 1.
      </>
    ),
  },
  {
    title: 'Dynamic',
    icon: <MdFlight size={26} />,
    description: (
      <>
        Built upon SeaQuery, SeaORM allows you to build complex dynamic queries.
      </>
    ),
  },
  {
    title: 'Service Oriented',
    icon: <MdCloud size={26} />,
    description: (
      <>
        Quickly build services that join, filter, sort and paginate data in REST, GraphQL and gRPC APIs.
      </>
    ),
  },
  {
    title: 'Production Ready',
    icon: <MdCheckCircle size={26} />,
    description: (
      <>
        SeaORM is feature-rich, well-tested and used in production by companies and startups.
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--6')}>
      <div style={{ paddingBottom: '20px', paddingTop: '20px' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ paddingRight: '22px' }}>{icon}</div>
          <h3 style={{ fontSize: '20px', color: 'var(--ifm-color-primary)' }}>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
          <div className="col col--11 col--offset-1">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
