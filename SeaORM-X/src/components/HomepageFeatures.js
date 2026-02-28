import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { MdCloud, MdCheckCircle, MdFlashOn, MdFlight } from "react-icons/md";

const FeatureList = [
  {
    title: 'Native MSSQL Driver',
    icon: <MdFlashOn size={26} />,
    description: (
      <>
        Powered by SQLz with connection pooling, nested transactions via savepoints, and automatic schema rewriting.
      </>
    ),
  },
  {
    title: 'Built on SeaORM 2.0',
    icon: <MdFlashOn size={26} />,
    description: (
      <>
        Every 2.0 feature ships to MSSQL: Entity Loader, Nested ActiveModel, strongly-typed COLUMN, and <code>raw_sql!</code> macro.
      </>
    ),
  },
  {
    title: 'Schema First or Entity First',
    icon: <MdCheckCircle size={26} />,
    description: (
      <>
        Generate entities from existing MSSQL schemas with <code>sea-orm-cli</code>, or define entities in Rust and sync to the database.
      </>
    ),
  },
  {
    title: 'Service Oriented',
    icon: <MdCloud size={26} />,
    description: (
      <>
        Build services that join, filter, sort and paginate data in REST, GraphQL and gRPC APIs. Works with Actix, Axum, Loco, Poem, and more.
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
