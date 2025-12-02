import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import { MdCloud, MdCheckCircle, MdFlashOn, MdFlight } from "react-icons/md";

const FeatureList = [
  {
    title: 'Advanced Relations',
    icon: <MdFlashOn size={26} />,
    description: (
      <>
        Model complex relationships 1-1, 1-N, M-N, and even self-referential in a high-level, conceptual way.
      </>
    ),
  },
  {
    title: 'Familiar Concepts',
    icon: <MdFlight size={26} />,
    description: (
      <>
        Inspired by popular ORMs in the Ruby, Python, and Node.js ecosystem, SeaORM offers a developer experience that feels instantly recognizable.
      </>
    ),
  },
  {
    title: 'Feature Rich',
    icon: <MdCloud size={26} />,
    description: (
      <>
        SeaORM is a batteries-included ORM with filters, pagination, and nested queries to accelerate building REST, GraphQL, and gRPC APIs.
      </>
    ),
  },
  {
    title: 'Production Ready',
    icon: <MdCheckCircle size={26} />,
    description: (
      <>
        With 250k+ weekly downloads, SeaORM is production-ready, trusted by startups and enterprises worldwide.
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
