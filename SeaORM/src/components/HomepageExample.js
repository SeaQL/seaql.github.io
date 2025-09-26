import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import styles from './HomepageExample.module.css';
import { Highlight, themes } from "prism-react-renderer";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from '@docusaurus/theme-common';

import Prism from 'prismjs/components/prism-core';
(typeof global !== "undefined" ? global : window).Prism = Prism;
require("prismjs/components/prism-rust");

const codeBlocks = [
  {
    title: 'Entity',
    summary: 'You don\'t have to write this by hand! Entity files can be generated from an existing database with sea-orm-cli.',
    code: `use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}`
  },
  {
    title: 'Select',
    summary: 'SeaORM models 1-N and M-N relationships at the Entity level, letting you traverse many-to-many links through a junction table in a single call.',
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

// find related models (eager): for 1-1 relations
let cake_with_fruit: Vec<(cake::Model, Option<fruit::Model>)> =
    Cake::find().find_also_related(Fruit).all(db).await?;

// find related models (eager): works for both 1-N and M-N relations
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit) // for M-N relations, two joins are performed
    .all(db) // rows are automatically consolidated by left entity
    .await?;`,
  },
  {
    title: 'Nested Select',
    summary: 'Partial models prevent overfetching by letting you querying only the fields you need; it also makes writing deeply nested relational queries simple.',
    code: `use sea_orm::DerivePartialModel;

#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct CakeWithFruit {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    fruit: Option<fruit::Model>, // this can be a regular or another partial model
}

let cakes: Vec<CakeWithFruit> = Cake::find()
    .left_join(fruit::Entity) // no need to specify join condition
    .into_partial_model() // only the columns in the partial model will be selected
    .all(db)
    .await?;`,
  },
  {
    title: 'Insert',
    summary: "SeaORM's ActiveModel lets you work directly with Rust data structures and persist them through a simple API.",
    code: `let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default() // no need to set primary key
};

let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default()
};

// insert one: Active Record style
let apple = apple.insert(db).await?;
apple.id == 1;

// insert one: repository style
let result = Fruit::insert(apple).exec(db).await?;
result.last_insert_id == 1;

// insert many returning last insert id
let result = Fruit::insert_many([apple, pear]).exec(db).await?;
result.last_insert_id == Some(2);`,
  },
  {
    title: 'Insert (advanced)',
    summary: 'You can take advantage of database specific features to perform upsert and idempotent insert.',
    code: `// insert many with returning (if supported by database)
let models: Vec<fruit::Model> = Fruit::insert_many([apple, pear])
    .exec_with_returning(db)
    .await?;
models[0]
    == fruit::Model {
        id: 1, // database assigned value
        name: "Apple".to_owned(),
        cake_id: None,
    };

// insert with ON CONFLICT on primary key do nothing, with MySQL specific polyfill
let result = Fruit::insert_many([apple, pear])
    .on_conflict_do_nothing()
    .exec(db)
    .await?;

matches!(result, TryInsertResult::Conflicted);`
  },
  {
    title: 'Update',
    summary: "ActiveModel avoids race conditions by updating only the fields you've changed, never overwriting untouched columns. You can also craft complex bulk update queries with a fluent query building API.",
    code: `use fruit::Column::CakeId;
use sea_orm::sea_query::{Expr, Value};

let pear: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let mut pear: fruit::ActiveModel = pear.unwrap().into();

pear.name = Set("Sweet pear".to_owned()); // update value of a single field

// update one: only changed columns will be updated
let pear: fruit::Model = pear.update(db).await?;

// update many: UPDATE "fruit" SET "cake_id" = "cake_id" + 2
//               WHERE "fruit"."name" LIKE '%Apple%'
Fruit::update_many()
    .col_expr(CakeId, Expr::col(CakeId).add(Expr::val(2)))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;`,
  },
  {
    title: 'Save',
    summary: 'You can perform "insert or update" operation with ActiveModel, making it easy to compose transactional operations.',
    code: `let banana = fruit::ActiveModel {
    id: NotSet,
    name: Set("Banana".to_owned()),
    ..Default::default()
};

// create, because primary key \`id\` is \`NotSet\`
let mut banana = banana.save(db).await?;

banana.id == Unchanged(2);
banana.name = Set("Banana Mongo".to_owned());

// update, because primary key \`id\` is present
let banana = banana.save(db).await?;`,
  },
  {
    title: 'Delete',
    summary: 'The same ActiveModel API consistent with insert and update.',
    code: `// delete one: Active Record style
let orange: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let orange: fruit::Model = orange.unwrap();
orange.delete(db).await?;

// delete one: repository style
let orange = fruit::ActiveModel {
    id: Set(2),
    ..Default::default()
};
fruit::Entity::delete(orange).exec(db).await?;

// delete many: DELETE FROM "fruit" WHERE "fruit"."name" LIKE '%Orange%'
fruit::Entity::delete_many()
    .filter(fruit::Column::Name.contains("Orange"))
    .exec(db)
    .await?;`,
  },
  {
    title: 'Ergonomic Raw SQL',
    summary: `Let SeaORM handle 90% of all the transactional queries.
When your query is too complex to express, SeaORM still offer convenience in writing raw SQL.`,
    code: `#[derive(FromQueryResult)]
struct CakeWithBakery {
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(FromQueryResult)]
struct Bakery {
    #[sea_orm(alias = "bakery_name")]
    name: String,
}

let cake_ids = [2, 3, 4]; // expanded by the \`..\` operator

// can use many APIs with raw SQL, including nested select
let cake: Option<CakeWithBakery> = CakeWithBakery::find_by_statement(raw_sql!(
    Sqlite,
    r#"SELECT "cake"."name", "bakery"."name" AS "bakery_name"
       FROM "cake"
       LEFT JOIN "bakery" ON "cake"."bakery_id" = "bakery"."id"
       WHERE "cake"."id" IN ({..cake_ids})"#
))
.one(db)
.await?;`
  }
];

export default function HomepageExample() {
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
              <h2 className="text--center">A quick taste of SeaORM</h2>
              <Tabs
                className={clsx('aa')}
                defaultValue={codeBlocks[0].title}
                values={codeBlocks.map(({ title, code }) => {
                  return { label: title, value: title };
                })}
              >
                {codeBlocks.map(({ title, summary, code }, i) => (
                  <TabItem key={i} value={title}>
                    <p>{summary}</p>
                    <Highlight
                      code={code}
                      key={mounted}
                      theme={colorMode == 'dark' ? prismDarkTheme : prismTheme}
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
