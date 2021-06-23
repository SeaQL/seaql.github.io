Introduction
1. What is an ORM
2. Async concepts
3. Schema & Entity

Getting Started
1. Installation & Configuration
	1.1 choosing a database & async runtime
2. Generating Entities
	2.1 Entity Structure
3. Basic CRUD
	3.1 SELECT: find, find_one, filter, sort, paging
	3.2 INSERT: Model & ActiveModel, insert many
	3.3 UPDATE: find & save, update many
	3.4 DELETE: delete one & delete many
	3.5 Raw SQL query & QueryResult
4. Relations
	4.1 one-to-one
	4.2 one-to-many
	4.3 many-to-many
5. Writing Tests
	5.1 Mock interface
	5.2 Using SQLite
6. Advanced Queries
	6.1 Custom select
	6.2 Aggregate functions
	6.3 Conditional expressions
	6.4 Subquery
	6.5 More joins
7. Internal Design
	7.1 Derive macros
	7.2 Traits and types

# Comparison with Diesel

Diesel          SeaORM
=====           =====
Sync            Async
Static          Dynamic
Native Driver   Pure Rust
Macro heavy     Macro free
=====================
       Relational
      Schema first
     With Cli tools