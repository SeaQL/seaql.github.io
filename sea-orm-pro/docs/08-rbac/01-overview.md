# Overview

Here is a high level overview of the design and the requirements that shaped them:

### 1. Table‑level access control

Different user groups can only read or modify certain tables, e.g. customers can only read invoices, but not modify them.

Design: RBAC engine is table‑scoped so permissions can be expressed directly in terms of CRUD on tables.

### 2. Simplicity of user assignment

Each user should have a clear, unambiguous role to avoid confusion.

Design: one user = one role. This prevents complexity of multiple roles per user.

### 3. Role hierarchy and inheritance

We want to create roles that inherit from multiple roles like A = B + C where A will have the union of permissions from B and C.

We want to avoid duplicating permission sets across roles. For example, a 'Manager' should automatically get all 'Employee' permissions, plus extras.

Design: Hierarchical roles with multiple inheritance.

### 4. Granular, composable permissions

We need to allow fine‑grained control like 'read customers but not update them'. We want permission grant to be easy to reason about.

Design: Role can be assigned set of permissions (CRUD) on resources (tables). Permissions are additive, once granted, cannot be taken away (but can be overridden on a per user basis).

### 5. Extensibility

We want to extend beyond tables (e.g. application specific actions, or even non‑DB resources).

Design: Engine is generic - resource + permission abstraction can be applied to more than just CRUD operations on SQL tables.

### 6. Wildcard for convenience

Sometimes we need to grant superusers full access without enumerating every resource/permission.

Design: Opt‑in `*` wildcard for 'all permissions' or 'all resources.'

### 7. Per‑user overrides

Occasionally, a single user needs an exception (e.g. a contractor who can only read one table, or a manager who should be denied one sensitive table).

Design: User‑level overrides to grant/deny permissions.

:::tip

Read more on [Role Based Access Control in SeaORM 2.0](https://www.sea-ql.org/blog/2025-09-30-sea-orm-rbac/) blog post.

:::
