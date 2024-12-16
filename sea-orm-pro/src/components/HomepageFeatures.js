import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { FaReact } from "react-icons/fa";
import { GrGraphQl } from "react-icons/gr";
import { FiDatabase } from "react-icons/fi";
import { MdBackupTable, MdCode, MdSpeed } from "react-icons/md";


const FeatureList = [
  {
    title: 'Build on industry standard - React + GraphQL',
    icon: <FaReact size={26} />,
    description: (
      <>
        Professional, sleek user interface by Ant Design.
      </>
    ),
  },
  {
    title: 'GraphQL resolver? built-in',
    icon: <GrGraphQl size={26} />,
    description: (
      <>
        Gone are the days to build GraphQL resolvers by hand!
      </>
    ),
  },
  {
    title: '(Almost) Low Code',
    icon: <MdCode size={26} />,
    description: (
      <>
        Customize the UI easily with a simple, elegant toml syntax.
        Absolutely no generated code bloat.
      </>
    ),
  },
  {
    title: 'Instant Deployment',
    icon: <MdSpeed size={26} />,
    description: (
      <>
        Launch complete Admin Dashboard in minutes.
      </>
    ),
  },
  {
    title: 'CRUD - covered',
    icon: <FiDatabase size={26} />,
    description: (
      <>
        SeaORM Pro provides a full CRUD interface for your SeaORM models.
      </>
    ),
  },
  {
    title: 'Nested table for relational entities',
    icon: <MdBackupTable size={26} />,
    description: (
      <>
        Parent-child relations, e.g. Order-OrderItem, presented in a single table.
        Every type of SeaORM relationship is fully supported.
        Need to visualize the data on your polymorphic many-to-many relationship?
        We have you covered. 
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
