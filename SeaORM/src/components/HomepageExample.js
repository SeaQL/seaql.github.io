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
    title: 'Expressive Entity format',
    summary: 'You don\'t have to write this by hand! Entity files can be generated from an existing database with sea-orm-cli.',
    code: `use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(unique)]
    pub email: String,
    #[sea_orm(has_one)]
    pub profile: HasOne<super::profile::Entity>,
    #[sea_orm(has_many)]
    pub posts: HasMany<super::post::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}`
  },
  {
    title: 'Smart Entity Loader',
    summary: 'The Entity Loader intelligently uses join for 1-1 and data loader for 1-N relations, eliminating the N+1 problem even when performing nested queries.',
    code: `// join paths:
// user -> profile
// user -> post
//         post -> post_tag -> tag
let smart_user = user::Entity::load()
    .filter_by_id(42) // shorthand for .filter(user::COLUMN.id.eq(42))
    .with(profile::Entity) // 1-1 uses join
    .with((post::Entity, tag::Entity)) // 1-N uses data loader
    .one(db)
    .await?
    .unwrap();

smart_user
    == user::ModelEx {
        id: 42,
        name: "Bob".into(),
        email: "bob@sea-ql.org".into(),
        profile: HasOne::Loaded(profile::ModelEx {
            picture: "image.jpg".into(),
        }.into()),
        posts: HasMany::Loaded(vec![post::ModelEx {
            title: "Nice weather".into(),
            tags: HasMany::Loaded(vec![tag::ModelEx {
                tag: "diary".into(),
            }]),
        }]),
    };`,
  },
  {
    title: 'Entity First Workflow',
    summary: `SeaORM 2.0 supports a first-class Entity First Workflow: simply define new entities or add columns to existing ones, and SeaORM will automatically detect the changes and create the new tables, columns, unique keys, and foreign keys.`,
    code: `let item = Item { name: "Bob" }; // nested parameter access
let ids = [2, 3, 4]; // expanded by the .. operator

let user: Option<user::Model> = user::Entity::find()
    .from_raw_sql(raw_sql!(
        Sqlite,
        r#"SELECT "id", "name" FROM "user"
           WHERE "name" LIKE {item.name}
           AND "id" in ({..ids})
        "#
    ))
    .one(db)
    .await?;`
  },
  {
    title: 'Ergonomic Raw SQL',
    summary: `Let SeaORM handle 95% of your transactional queries. For the remaining cases that are too complex to express, SeaORM still offers convenient support for writing raw SQL.`,
    code: `let user = Item { name: "Bob" }; // nested parameter access
let ids = [2, 3, 4]; // expanded by the .. operator

let user: Option<user::Model> = user::Entity::find()
    .from_raw_sql(raw_sql!(
        Sqlite,
        r#"SELECT "id", "name" FROM "user"
           WHERE "name" LIKE {user.name}
           AND "id" in ({..ids})
        "#
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
              <h2 className="text--center">Unique features of SeaORM</h2>
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
