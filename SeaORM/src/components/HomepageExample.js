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
    code: `// find all models
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;

// find and filter
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .all(db)
    .await?;

// find one model
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// find related models (lazy)
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;

// find related models (eager)
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;`,
  },
  {
    title: 'Insert',
    code: `let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default() // no need to set primary key
};
 
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default()
};
 
// insert one
let res: InsertResult = Fruit::insert(pear).exec(db).await?;
 
println!("InsertResult: {}", res.last_insert_id);
 
// insert many
Fruit::insert_many(vec![apple, pear]).exec(db).await?;`,
  },
  {
    title: 'Update',
    code: `use sea_orm::sea_query::{Expr, Value};

let pear: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
 
let mut pear: fruit::ActiveModel = pear.unwrap().into();
pear.name = Set("Sweet pear".to_owned());
 
// update one
let pear: fruit::ActiveModel = Fruit::update(pear).exec(db).await?;
 
// update many: UPDATE "fruit" SET "cake_id" = NULL WHERE "fruit"."name" LIKE '%Apple%'
Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(Value::Null))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;`,
  },
  {
    title: 'Save',
    code: `let banana = fruit::ActiveModel {
    id: Unset(None),
    name: Set("Banana".to_owned()),
    ..Default::default()
};

// create, because primary key \`id\` is \`Unset\`
let mut banana = banana.save(db).await?;

banana.name = Set("Banana Mongo".to_owned());

// update, because primary key \`id\` is \`Set\`
let banana = banana.save(db).await?;`,
  },
  {
    title: 'Delete',
    code: `let orange: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let orange: fruit::ActiveModel = orange.unwrap().into();

// delete one
fruit::Entity::delete(orange).exec(db).await?;
// or simply
orange.delete(db).await?;

// delete many: DELETE FROM "fruit" WHERE "fruit"."name" LIKE 'Orange'
fruit::Entity::delete_many()
    .filter(fruit::Column::Name.contains("Orange"))
    .exec(db)
    .await?;`,
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
              <h2 className="text--center">A quick taste of SeaORM</h2>
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
