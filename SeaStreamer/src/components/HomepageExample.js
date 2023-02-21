import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';
import Highlight, { defaultProps } from "prism-react-renderer";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from '@docusaurus/theme-common';

import Prism from "prism-react-renderer/prism";
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-rust");

const codeBlocks = [
  {
    title: 'Consumer',
    full_example: 'https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/consumer.rs',
    code: `#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let Args { stream } = Args::from_args();

    let streamer = SeaStreamer::connect(
        std::env::var("STREAMER_URL")
            .unwrap_or_else(|_| "kafka://localhost:9092".to_owned())
            .parse()?,
        Default::default(),
    )
    .await?;

    let mut options = SeaConsumerOptions::new(ConsumerMode::RealTime);
    options.set_kafka_consumer_options(|options| {
        options.set_auto_offset_reset(AutoOffsetReset::Earliest);
    });
    let consumer: SeaConsumer = streamer.create_consumer(&[stream], options).await?;

    loop {
        let mess: SeaMessage = consumer.next().await?;
        println!("[{}] {}", mess.timestamp(), mess.message().as_str()?);
    }
}`
  },
  {
    title: 'Producer',
    full_example: 'https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/producer.rs',
    code: `#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let Args { stream } = Args::from_args();

    let streamer = SeaStreamer::connect(
        std::env::var("STREAMER_URL")
            .unwrap_or_else(|_| "kafka://localhost:9092".to_owned())
            .parse()?,
        Default::default(),
    )
    .await?;

    let producer: SeaProducer = streamer.create_producer(stream, Default::default()).await?;

    for tick in 0..10 {
        let message = format!(r#""tick {tick}""#);
        println!("{message}");
        producer.send(message)?;
        tokio::time::sleep(Duration::from_secs(1)).await;
    }

    producer.flush(Duration::from_secs(10)).await?;

    Ok(())
}`
  },
];

export default function HomepageCompare() {
  const {
    siteConfig: {
      themeConfig: { prism = {} },
    },
  } = useDocusaurusContext();

  const [mounted, setMounted] = useState(false);
  // The Prism theme on SSR is always the default theme but the site theme
  // can be in a different mode. React hydration doesn't update DOM styles
  // that come from SSR. Hence force a re-render after mounting to apply the
  // current relevant styles. There will be a flash seen of the original
  // styles seen using this current approach but that's probably ok. Fixing
  // the flash will require changing the theming approach and is not worth it
  // at this point.
  useEffect(() => {
    setMounted(true);
  }, []);

  const { colorMode } = useColorMode();
  const lightModeTheme = prism.theme;
  const darkModeTheme = prism.darkTheme || lightModeTheme;
  const prismTheme = colorMode === 'dark' ? darkModeTheme : lightModeTheme;

  return (
    <section className={clsx('home-section', styles.features)}>
      <div className="container">
        <div className="row">
        <div className={clsx('col col--12')}>
            <div className="padding-horiz--md">
              <h2 className="text--center">A quick taste of SeaStreamer</h2>
              <Tabs
                className={clsx('aa')}
                defaultValue={codeBlocks[0].title}
                values={codeBlocks.map(({ title, code }) => {
                  return { label: title, value: title };
                })}
              >
                {codeBlocks.map(({ title, code, full_example }, i) => (
                  <TabItem key={i} value={title}>
                    <p>
                      Here is a basic stream {title.toLowerCase()}, <a href={full_example}>full example</a>:
                    </p>
                    <Highlight
                      {...defaultProps}
                      code={code}
                      key={mounted}
                      theme={prismTheme}
                      language="rust"
                    >
                      {({ className, tokens, getLineProps, getTokenProps }) => (
                        <pre
                          className={`${className}`}
                          style={{ backgroundColor: '#292d3e' }}
                        >
                          {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                              {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </TabItem>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
