import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';
import { Highlight, themes } from "prism-react-renderer";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useColorMode } from '@docusaurus/theme-common';


const codeBlocks = [
  {
    title: 'Query Builder',
    code: `// A table create statement
let table = Table::create()
    .table(Glyph::Table)
    .col(ColumnDef::new(Glyph::Id).integer().not_null().auto_increment().primary_key())
    .col(ColumnDef::new(Glyph::Aspect).integer().not_null())
    .col(ColumnDef::new(Glyph::Image).string().not_null())
    .foreign_key(
        ForeignKey::create()
            .name("FK_2e303c3a712662f1fc2a4d0aad6")
            .from(Glyph::Table, Glyph::Id)
            .to(CharGlyph::Table, CharGlyph::GlyphId)
            .on_delete(ForeignKeyAction::Cascade)
            .on_update(ForeignKeyAction::Cascade)
    )
    .to_owned();

assert_eq!(
    table.to_string(MsSqlQueryBuilder),
    [
        r#"CREATE TABLE [glyph] ("#,
            r#"[id] int NOT NULL IDENTITY PRIMARY KEY,"#,
            r#"[aspect] int NOT NULL,"#,
            r#"[image] nvarchar(255) NOT NULL,"#,
            r#"CONSTRAINT [FK_2e303c3a712662f1fc2a4d0aad6]"#,
                r#"FOREIGN KEY ([id]) REFERENCES [character_glyph] ([glyph_id])"#,
                r#"ON DELETE CASCADE ON UPDATE CASCADE"#,
        r#")"#,
    ].join(" ")
);

// A prepared select statement
assert_eq!(
    Query::select()
        .column(Glyph::Image)
        .from(Glyph::Table)
        .and_where(Expr::col(Glyph::Image).like("A"))
        .and_where(Expr::col(Glyph::Id).is_in([1, 2, 3]))
        .build(MsSqlQueryBuilder),
    (
        "SELECT [image] FROM [glyph] WHERE [image] LIKE @P1 AND [id] IN (@P2, @P3, @P4)"
            .to_owned(),
        Values(vec![
            Value::String(Some(Box::new("A".to_owned()))),
            Value::Int(Some(1)),
            Value::Int(Some(2)),
            Value::Int(Some(3))
        ])
    )
);

// A raw select statement
assert_eq!(
    Query::select()
        .column(Glyph::Id)
        .from(Glyph::Table)
        .cond_where(
            Cond::any()
                .add(
                    Cond::all()
                        .add(Expr::col(Glyph::Aspect).is_null())
                        .add(Expr::col(Glyph::Image).is_null())
                )
                .add(
                    Cond::all()
                        .add(Expr::col(Glyph::Aspect).is_in([3, 4]))
                        .add(Expr::col(Glyph::Image).like("A%"))
                )
        )
        .to_string(MsSqlQueryBuilder),
    [
        r#"SELECT [id] FROM [glyph]"#,
        r#"WHERE ([aspect] IS NULL AND [image] IS NULL)"#,
        r#"OR ([aspect] IN (3, 4) AND [image] LIKE 'A%')"#,
    ]
    .join(" ")
);`
  },
  {
    title: 'Schema Discovery',
    code: `let options: MsSqlConnectOptions = "mssql://sa:YourStrong()Passw0rd@localhost/AdventureWorksLT2016".parse()?;
let connection = MsSqlPool::connect_with(options).await?;
// Set the target schema: "SalesLT" or None (defaults to "dbo")
let schema_discovery = SchemaDiscovery::new(connection, Some("SalesLT"));

assert_eq!(
    schema_discovery.discover().await?,
    Schema {
        database: "AdventureWorksLT2016",
        schema: "SalesLT",
        version: Version {
            name: "Microsoft SQL Server 2017",
            service_pack: "RTM-CU31-GDR",
            version: "14.0.3465.1",
            edition: "Developer Edition",
        },
        tables: vec![
            TableDef {
                name: "Address",
                columns: vec![
                    ColumnInfo {
                        name: "AddressID",
                        col_type: Int,
                        null: false,
                        is_identity: true,
                        collation: None,
                        default: None,
                        comment: Some("Primary key for Address records."),
                    },
                    ColumnInfo {
                        name: "AddressLine1",
                        col_type: Nvarchar(N(60)),
                        null: false,
                        is_identity: false,
                        collation: Some(Collation("SQL_Latin1_General_CP1_CI_AS")),
                        default: None,
                        comment: Some("First street address line."),
                    },
                    ColumnInfo {
                        name: "AddressLine2",
                        col_type: Nvarchar(N(60)),
                        null: true,
                        is_identity: false,
                        collation: Some(Collation("SQL_Latin1_General_CP1_CI_AS")),
                        default: None,
                        comment: Some("Second street address line."),
                    },
                    ColumnInfo {
                        name: "City",
                        col_type: Nvarchar(N(30)),
                        null: false,
                        is_identity: false,
                        collation: Some(Collation("SQL_Latin1_General_CP1_CI_AS")),
                        default: None,
                        comment: Some("Name of the city."),
                    },
                    ColumnInfo {
                        name: "StateProvince",
                        col_type: Nvarchar(N(50)),
                        null: false,
                        is_identity: false,
                        collation: Some(Collation("SQL_Latin1_General_CP1_CI_AS")),
                        default: None,
                        comment: Some("Name of state or province."),
                    },
                    ColumnInfo {
                        name: "CountryRegion",
                        col_type: Nvarchar(N(50)),
                        null: false,
                        is_identity: false,
                        collation: Some(Collation("SQL_Latin1_General_CP1_CI_AS")),
                        default: None,
                        comment: None,
                    },
                    ColumnInfo {
                        name: "PostalCode",
                        col_type: Nvarchar(N(15)),
                        null: false,
                        is_identity: false,
                        collation: Some(Collation("SQL_Latin1_General_CP1_CI_AS")),
                        default: None,
                        comment: Some("Postal code for the street address."),
                    },
                    ColumnInfo {
                        name: "rowguid",
                        col_type: UniqueIdentifier,
                        null: false,
                        is_identity: false,
                        collation: None,
                        default: Some(NewId),
                        comment: Some("ROWGUIDCOL number uniquely identifying the record. Used to support a merge replication sample."),
                    },
                    ColumnInfo {
                        name: "ModifiedDate",
                        col_type: DateTime,
                        null: false,
                        is_identity: false,
                        collation: None,
                        default: Some(GetDate),
                        comment: Some("Date and time the record was last updated."),
                    },
                ],
                indexes: vec![
                    IndexInfo {
                        is_primary_key: false,
                        is_unique: true,
                        name: "AK_Address_rowguid",
                        index_type: NonClustered,
                        parts: vec![
                            IndexPart { column: "rowguid", order: Ascending },
                        ],
                    },
                    IndexInfo {
                        is_primary_key: false,
                        is_unique: false,
                        name: "IX_Address_AddressLine1_AddressLine2_City_StateProvince_PostalCode_CountryRegion",
                        index_type: NonClustered,
                        parts: vec![
                            IndexPart { column: "AddressLine1", order: Ascending },
                            IndexPart { column: "AddressLine2", order: Ascending },
                            IndexPart { column: "City", order: Ascending },
                            IndexPart { column: "StateProvince", order: Ascending },
                            IndexPart { column: "PostalCode", order: Ascending },
                            IndexPart { column: "CountryRegion", order: Ascending },
                        ],
                    },
                    IndexInfo {
                        is_primary_key: false,
                        is_unique: false,
                        name: "IX_Address_StateProvince",
                        index_type: NonClustered,
                        parts: vec![
                            IndexPart { column: "StateProvince", order: Ascending },
                        ],
                    },
                    IndexInfo {
                        is_primary_key: true,
                        is_unique: true,
                        name: "PK_Address_AddressID",
                        index_type: Clustered,
                        parts: vec![
                            IndexPart { column: "AddressID", order: Ascending },
                        ],
                    },
                ],
                foreign_keys: vec![],
                comment: Some("Street address information for customers."),
            },
            // ...
        ],
    }
);`
  },
  {
    title: 'Entity Generation',
    lang: 'shell',
    code: `# Generate entity file from database schema
$ sea-orm-cli generate entity --database-url "mssql://sa:YourStrong()Passw0rd@localhost/AdventureWorksLT2016" --database-schema "SalesLT"

Connecting to MSSQL ...
Discovering schema ...
... discovered.
Generating address.rs
    > Column \`AddressID\`: i32, auto_increment, not_null
    > Column \`AddressLine1\`: String, not_null
    > Column \`AddressLine2\`: Option<String>
    > Column \`City\`: String, not_null
    > Column \`StateProvince\`: String, not_null
    > Column \`CountryRegion\`: String, not_null
    > Column \`PostalCode\`: String, not_null
    > Column \`rowguid\`: Uuid, not_null, unique
    > Column \`ModifiedDate\`: DateTime, not_null
...


# Inside the generated entity file
$ cat address.rs

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(schema_name = "SalesLT", table_name = "Address")]
pub struct Model {
    #[sea_orm(column_name = "AddressID", primary_key)]
    pub address_id: i32,
    #[sea_orm(column_name = "AddressLine1")]
    pub address_line1: String,
    #[sea_orm(column_name = "AddressLine2")]
    pub address_line2: Option<String>,
    #[sea_orm(column_name = "City")]
    pub city: String,
    #[sea_orm(column_name = "StateProvince")]
    pub state_province: String,
    #[sea_orm(column_name = "CountryRegion")]
    pub country_region: String,
    #[sea_orm(column_name = "PostalCode")]
    pub postal_code: String,
    #[sea_orm(unique)]
    pub rowguid: Uuid,
    #[sea_orm(column_name = "ModifiedDate")]
    pub modified_date: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}`
  },
  {
    title: 'CRUD Operations',
    code: `// Insert
let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default() // no need to set primary key
};

let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default()
};

// Insert one
let pear = pear.insert(db).await?;

// Insert many
Fruit::insert_many([apple, pear]).exec(db).await?;



// Find all models
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;

// Find and filter
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .all(db)
    .await?;

// Find one model
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Find related models (lazy)
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;

// Find related models (eager)
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> =
    Cake::find().find_with_related(Fruit).all(db).await?;



// Update
let pear: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let mut pear: fruit::ActiveModel = pear.unwrap().into();

pear.name = Set("Sweet pear".to_owned());

// Update one
let pear: fruit::Model = pear.update(db).await?;

// Update many
Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(Value::Int(None)))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;



// Save
let banana = fruit::ActiveModel {
    id: NotSet,
    name: Set("Banana".to_owned()),
    ..Default::default()
};

// Create, because primary key \`id\` is \`NotSet\`
let mut banana = banana.save(db).await?;

banana.name = Set("Banana Mongo".to_owned());

// Update, because primary key \`id\` is \`Set\`
let banana = banana.save(db).await?;



// Delete one
let orange: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let orange: fruit::Model = orange.unwrap();
fruit::Entity::delete(orange.into_active_model())
    .exec(db)
    .await?;

// Or simply
let orange: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let orange: fruit::Model = orange.unwrap();
orange.delete(db).await?;

// Delete many: DELETE FROM "fruit" WHERE "fruit"."name" LIKE 'Orange'
fruit::Entity::delete_many()
    .filter(fruit::Column::Name.contains("Orange"))
    .exec(db)
    .await?;`
  },
  {
    title: 'Identity Insert',
    code: `// Insert an active model with a specific primary key value.
// For MSSQL, SeaORM X will automatically enable \`IDENTITY INSERT\` when inserting a row with primary key value,
// and then disable the \`IDENTITY INSERT\` once the insert finished.

let pear = fruit::ActiveModel {
    id: Set(1),
    name: Set("Pear".to_owned()),
    cake_id: NotSet,
};

// \`IDENTITY INSERT\` behind the hood
let pear: fruit::Model = pear.insert(db).await?;`
  },
  {
    title: 'Nested Transaction',
    code: `assert_eq!(Bakery::find().all(txn).await?.len(), 0);

ctx.db.transaction::<_, _, DbErr>(|txn| {
    Box::pin(async move {
        let _ = bakery::ActiveModel {..}.save(txn).await?;
        let _ = bakery::ActiveModel {..}.save(txn).await?;
        assert_eq!(Bakery::find().all(txn).await?.len(), 2);

        // Try nested transaction committed
        txn.transaction::<_, _, DbErr>(|txn| {
            Box::pin(async move {
                let _ = bakery::ActiveModel {..}.save(txn).await?;
                assert_eq!(Bakery::find().all(txn).await?.len(), 3);

                // Try nested-nested transaction rollbacked
                assert!(txn.transaction::<_, _, DbErr>(|txn| {
                        Box::pin(async move {
                            let _ = bakery::ActiveModel {..}.save(txn).await?;
                            assert_eq!(Bakery::find().all(txn).await?.len(), 4);

                            Err(DbErr::Query(RuntimeErr::Internal(
                                "Force Rollback!".to_owned(),
                            )))
                        })
                    })
                    .await
                    .is_err()
                );

                assert_eq!(Bakery::find().all(txn).await?.len(), 3);

                // Try nested-nested transaction committed
                txn.transaction::<_, _, DbErr>(|txn| {
                    Box::pin(async move {
                        let _ = bakery::ActiveModel {..}.save(txn).await?;
                        assert_eq!(Bakery::find().all(txn).await?.len(), 4);

                        Ok(())
                    })
                })
                .await;

                assert_eq!(Bakery::find().all(txn).await?.len(), 4);

                Ok(())
            })
        })
        .await;

        Ok(())
    })
})
.await;

assert_eq!(Bakery::find().all(txn).await?.len(), 4);`
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
              <h2 className="text--center">A quick taste of SeaORM X</h2>
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
