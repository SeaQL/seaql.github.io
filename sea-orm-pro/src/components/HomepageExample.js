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
    title: '1',
    code: ``
  },
  {
    title: '2',
    code: ``
  },
  {
    title: '3',
    code: ``
  },
  {
    title: '4',
    code: ``
  },
  {
    title: '5',
    code: ``
  },
  {
    title: '6',
    code: ``
  },
];

export default function HomepageCompare() {
  const {
    siteConfig: {
      themeConfig: { prism = {} },
    },
  } = useDocusaurusContext();
  const { colorMode } = useColorMode();

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
  const prismDarkTheme = prism.darkTheme;

  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
        <div className={clsx('col col--12')}>
            <div className="padding-horiz--md">
              <h2 className="text--center">A quick taste of SeaORM Pro</h2>
              <Tabs
                className={clsx('aa')}
                defaultValue={codeBlocks[0].title}
                values={codeBlocks.map(({ title, code }) => {
                  return { label: title, value: title };
                })}
              >
                {codeBlocks.map(({ title, code, lang }, i) => (
                  <TabItem key={i} value={title}>
                    <Highlight
                      {...defaultProps}
                      code={code}
                      key={mounted}
                      theme={colorMode == 'dark' ? prismDarkTheme : prismTheme}
                      language={lang ?? 'rust'}
                    >
                      {({ className, tokens, getLineProps, getTokenProps }) => (
                        <pre className={`${className}`}>
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
