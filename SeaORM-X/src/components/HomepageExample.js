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
    code: `let options: MsSqlConnectOptions =
    "mssql://sa:password@localhost/AdventureWorksLT2016".parse()?;
let connection = MsSqlPool::connect_with(options).await?;
let schema_discovery = SchemaDiscovery::new(connection, Some("SalesLT"));

let schema = schema_discovery.discover().await?;
// Schema {
//     database: "AdventureWorksLT2016",
//     schema: "SalesLT",
//     version: Version { name: "Microsoft SQL Server 2017", .. },
//     tables: [
//         TableDef {
//             name: "Address",
//             columns: [
//                 ColumnInfo { name: "AddressID", col_type: Int,
//                              is_identity: true, .. },
//                 ColumnInfo { name: "AddressLine1", col_type: Nvarchar(N(60)),
//                              collation: Some("SQL_Latin1_General_CP1_CI_AS"), .. },
//                 ColumnInfo { name: "City", col_type: Nvarchar(N(30)), .. },
//                 ColumnInfo { name: "rowguid", col_type: UniqueIdentifier,
//                              default: Some(NewId), .. },
//                 ColumnInfo { name: "ModifiedDate", col_type: DateTime,
//                              default: Some(GetDate), .. },
//                 // ...
//             ],
//             indexes: [
//                 IndexInfo { name: "PK_Address_AddressID",
//                             is_primary_key: true, index_type: Clustered, .. },
//                 IndexInfo { name: "AK_Address_rowguid",
//                             is_unique: true, index_type: NonClustered, .. },
//                 // ...
//             ],
//         },
//         // ... more tables
//     ],
// }

// Then generate entities from the discovered schema:
// sea-orm-cli generate entity \\
//   --database-url "mssql://sa:password@localhost/AdventureWorksLT2016" \\
//   --database-schema "SalesLT" --entity-format dense`
  },
  {
    title: 'Entity Format',
    code: `// Generated with: sea-orm-cli generate entity --entity-format dense
// Entities include inline relations and strongly-typed COLUMN constants

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
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
    #[sea_orm(unique)]
    pub rowguid: Uuid,
    #[sea_orm(column_name = "ModifiedDate")]
    pub modified_date: DateTime,
    #[sea_orm(has_many)]
    pub orders: HasMany<super::order::Entity>,
}

// Strongly-typed column access with compile-time checks
address::COLUMN.city.contains("Seattle")       // StringColumn
address::COLUMN.address_id.between(1, 100)     // NumericColumn
address::COLUMN.modified_date.gt(some_date)    // DateTimeLikeColumn`
  },
  {
    title: 'CRUD Operations',
    code: `// Insert one
let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default()
};
let apple: fruit::Model = apple.insert(db).await?;

// Insert many with OUTPUT INSERTED (MSSQL-native RETURNING)
let models: Vec<fruit::Model> = Fruit::insert_many([apple, pear])
    .exec_with_returning(db).await?;

// Find with strongly-typed COLUMN (2.0)
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::COLUMN.name.contains("chocolate"))
    .all(db).await?;

// Find related models (eager)
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> =
    Cake::find().find_with_related(Fruit).all(db).await?;

// Update: only changed columns are sent
let pear: Option<fruit::Model> = Fruit::find_by_id(1).one(db).await?;
let mut pear: fruit::ActiveModel = pear.unwrap().into();
pear.name = Set("Sweet pear".to_owned());
let pear: fruit::Model = pear.update(db).await?;

// Bulk update with COLUMN
Fruit::update_many()
    .col_expr(fruit::COLUMN.cake_id, fruit::COLUMN.cake_id.add(2))
    .filter(fruit::COLUMN.name.contains("Apple"))
    .exec(db).await?;

// Save: insert or update based on primary key state
let mut banana = fruit::ActiveModel {
    id: NotSet, name: Set("Banana".to_owned()), ..Default::default()
};
let banana = banana.save(db).await?; // INSERT (id is NotSet)

// Delete
fruit::Entity::delete_many()
    .filter(fruit::COLUMN.name.contains("Orange"))
    .exec(db).await?;`
  },
  {
    title: 'MSSQL Features',
    code: `// Automatic IDENTITY_INSERT when setting an explicit PK
let bakery = bakery::ActiveModel {
    id: Set(1), // triggers SET IDENTITY_INSERT ON/OFF automatically
    name: Set("SeaSide Bakery".to_owned()),
    ..Default::default()
};
Bakery::insert(bakery).exec(db).await?;

// Schema rewriting: all queries are prefixed with the configured schema
let db = Database::connect(
    "mssql://user:pass@localhost/my_db?currentSchema=my_schema"
).await?;

// EXISTS subquery across M-N relations
let related = cake::Entity::find()
    .has_related(filling::Entity, filling::COLUMN.name.eq("Marmalade"))
    .all(db).await?;
// SELECT [cake].* FROM [my_schema].[cake]
// WHERE EXISTS(SELECT 1 FROM [my_schema].[filling] ...)

// Tuple IN fallback: automatically expands for MSSQL
cake::Entity::find()
    .filter(cake::Entity::column_tuple_in(
        [cake::Column::Id, cake::Column::Name],
        &[(1i32, "a").into_value_tuple(), (2i32, "b").into_value_tuple()],
        DbBackend::MsSql,
    ).unwrap())
    .all(db).await?;
// WHERE ([id] = 1 AND [name] = 'a') OR ([id] = 2 AND [name] = 'b')`
  },
  {
    title: 'Nested Transaction',
    code: `// Nested transactions map to MSSQL savepoints automatically:
//   BEGIN TRAN
//     SAVE TRAN _sqlz_savepoint_1
//       SAVE TRAN _sqlz_savepoint_2
//       ROLLBACK TRAN _sqlz_savepoint_2  (drop without commit)
//     -- savepoint 1 released on commit
//   COMMIT TRAN

let txn = db.begin().await?;

{
    let txn = txn.begin().await?;  // SAVE TRAN _sqlz_savepoint_1
    bakery::ActiveModel { name: Set("Bakery A".into()), .. }
        .save(&txn).await?;

    {
        let txn = txn.begin().await?;  // SAVE TRAN _sqlz_savepoint_2
        bakery::ActiveModel { name: Set("Bakery B".into()), .. }
            .save(&txn).await?;
        // dropped without commit: rolls back to savepoint
    }

    // Bakery B is gone, Bakery A remains
    assert_eq!(Bakery::find().all(&txn).await?.len(), 1);

    {
        let txn = txn.begin().await?;
        bakery::ActiveModel { name: Set("Bakery C".into()), .. }
            .save(&txn).await?;
        txn.commit().await?;  // savepoint released
    }

    txn.commit().await?;
}

assert_eq!(Bakery::find().all(&txn).await?.len(), 2); // A and C
txn.commit().await?;  // COMMIT TRAN`
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
              <h2 className="text--center">SeaORM X in action</h2>
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
