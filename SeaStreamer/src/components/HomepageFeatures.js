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
        SeaStreamer provides an async API, and it supports both 'tokio' and 'async-std'. In tandem with other async Rust libraries, you can build highly concurrent stream processors.
      </>
    ),
  },
  {
    title: 'Generic',
    icon: <MdFlight size={26} />,
    description: (
      <>
        We provide integration for Kafka / Redpanda behind a generic trait interface, so your program can be backend-agnostic. Support for Redis Stream is being planned.
      </>
    ),
  },
  {
    title: 'Testable',
    icon: <MdCheckCircle size={26} />,
    description: (
      <>
        SeaStreamer also provides a set of tools to work with streams via unix pipes, so it is testable without setting up a cluster, and extremely handy when working locally.
      </>
    ),
  },
  {
    title: 'Micro-service Oriented',
    icon: <MdCloud size={26} />,
    description: (
      <>
        Let's build real-time (multi-threaded, no GC), self-contained (aka easy to deploy), low-resource-usage, long-running stream processors in Rust!
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
