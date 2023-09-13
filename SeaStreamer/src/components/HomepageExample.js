import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';
import Highlight, { defaultProps } from "prism-react-renderer";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

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

    let streamer = SeaStreamer::connect(stream.streamer(), Default::default()).await?;

    let mut options = SeaConsumerOptions::new(ConsumerMode::RealTime);
    options.set_auto_stream_reset(SeaStreamReset::Earliest);

    let consumer: SeaConsumer = streamer
        .create_consumer(stream.stream_keys(), options)
        .await?;

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

    let streamer = SeaStreamer::connect(stream.streamer(), Default::default()).await?;

    let producer: SeaProducer = streamer
        .create_producer(stream.stream_key()?, Default::default())
        .await?;

    for tick in 0..100 {
        let message = format!(r#""tick {tick}""#);
        eprintln!("{message}");
        producer.send(message)?;
        tokio::time::sleep(Duration::from_secs(1)).await;
    }

    producer.end().await?; // flush

    Ok(())
}`
  },
  {
    title: 'Processor',
    full_example: 'https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/processor.rs',
    code: `#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let Args { input, output } = Args::from_args();

    let streamer = SeaStreamer::connect(input.streamer(), Default::default()).await?;
    let options = SeaConsumerOptions::new(ConsumerMode::RealTime);
    let consumer: SeaConsumer = streamer
        .create_consumer(input.stream_keys(), options)
        .await?;

    let streamer = SeaStreamer::connect(output.streamer(), Default::default()).await?;
    let producer: SeaProducer = streamer
        .create_producer(output.stream_key()?, Default::default())
        .await?;

    loop {
        let message: SeaMessage = consumer.next().await?;
        let message = process(message).await?;
        eprintln!("{message}");
        producer.send(message)?; // send is non-blocking
    }
}`
  },
  {
    title: 'Running with Kafka',
    code: `# Produce some input
cargo run --bin producer -- --stream kafka://localhost:9092/hello1 &
# Start the processor, producing some output
cargo run --bin processor -- --input kafka://localhost:9092/hello1 --output kafka://localhost:9092/hello2 &
# Replay the output
cargo run --bin consumer -- --stream kafka://localhost:9092/hello2
# Remember to stop the processes
kill %1 %2`
  },
  {
    title: 'Running with Redis',
    code: `# Produce some input
cargo run --bin producer -- --stream redis://localhost:6379/hello1 &
# Start the processor, producing some output
cargo run --bin processor -- --input redis://localhost:6379/hello1 --output redis://localhost:6379/hello2 &
# Replay the output
cargo run --bin consumer -- --stream redis://localhost:6379/hello2
# Remember to stop the processes
kill %1 %2`
  },
  {
    title: 'Running with File',
    code: `# Create the file
file=/tmp/sea-streamer-$(date +%s)
touch $file && echo "File created at $file"
# Produce some input
cargo run --bin producer -- --stream file://$file/hello &
# Replay the input
cargo run --bin consumer -- --stream file://$file/hello
# Start the processor, producing some output
cargo run --bin processor -- --input file://$file/hello --output stdio:///hello`
  },
  {
    title: 'Running with Stdio',
    code: `# Pipe the producer to the processor
cargo run --bin producer -- --stream stdio:///hello1 | \
cargo run --bin processor -- --input stdio:///hello1 --output stdio:///hello2`
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

  const prismTheme = prism.theme;

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
                    {full_example &&
                      <p>
                        Here is a basic stream {title.toLowerCase()}, <a href={full_example}>full example</a>:
                      </p>
                    }
                    <Highlight
                      {...defaultProps}
                      code={code}
                      key={mounted}
                      theme={prismTheme}
                      language={ full_example ? 'rust' : 'shell' }
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
