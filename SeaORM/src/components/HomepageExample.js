import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';
import Highlight, { defaultProps } from "prism-react-renderer";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useThemeContext from "@theme/hooks/useThemeContext";

import Prism from "prism-react-renderer/prism";
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-rust");

const codeBlocks = [
  {
    title: 'Select',
    code: `print!("find all cakes: ");

let cakes = Cake::find().all(db).await?;

println!();
for cc in cakes.iter() {
    println!("{:?}\\n", cc);
}

print!("find all fruits: ");

let fruits = Fruit::find().all(db).await?;

println!();
for ff in fruits.iter() {
    println!("{:?}\\n", ff);
}`,
  },
  {
    title: 'Insert',
    code: `let pear = fruit::ActiveModel {
    name: Set("pear".to_owned()),
    ..Default::default()
};
let res = Fruit::insert(pear).exec(db).await?;

println!();
println!("Inserted: {:?}\\n", res);`,
  },
  {
    title: 'Update',
    code: `let pear = Fruit::find_by_id(res.last_insert_id)
    .one(db)
    .await
    .map_err(|_| ExecErr)?;

println!();
println!("Pear: {:?}\\n", pear);

let mut pear: fruit::ActiveModel = pear.unwrap().into();
pear.name = Set("Sweet pear".to_owned());

let res = Fruit::update(pear).exec(db).await?;

println!();
println!("Updated: {:?}\\n", res);`,
  },
  {
    title: 'Delete',
    code: `let banana = fruit::ActiveModel {
    name: Set("Banana".to_owned()),
    ..Default::default()
};
let mut banana = banana.save(db).await?;

println!();
println!("Inserted: {:?}\\n", banana);

banana.name = Set("Banana Mongo".to_owned());

let banana = banana.save(db).await?;

println!();
println!("Updated: {:?}\\n", banana);

let result = banana.delete(db).await?;

println!();
println!("Deleted: {:?}\\n", result);`,
  },
];

export default function HomepageCompare() {
  const prism  = useDocusaurusContext().siteConfig.themeConfig.prism;
  const { isDarkTheme } = useThemeContext();
  const theme = isDarkTheme ? prism.darkTheme : prism.theme;

  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
        <div className={clsx('col col--12')}>
            <div className="padding-horiz--md">
              <h2 className="text--center">Example</h2>
              <Tabs
                className={clsx('aa')}
                defaultValue={codeBlocks[0].title}
                values={codeBlocks.map(({ title, code }) => {
                  return { label: title, value: title };
                })}
              >
                {codeBlocks.map(({ title, code }, i) => (
                  <TabItem key={i} value={title}>
                    <Highlight
                      {...defaultProps}
                      code={code}
                      theme={theme}
                      language="rust"
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
