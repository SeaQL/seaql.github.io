# Role Permissions

## View Role Hierarchy Diagram

Role has a self-referencing relation, and they form a DAG (Directed Acyclic Graph). Most commonly they form a hierarchy tree that somewhat resembles an organization chart.

A simple tree example:

```
admin <- manager <- public
                 <- ...etc.
```

![](../../static/img/rbac-role-permissions-hierarchy-diagram.png#light)
![](../../static/img/rbac-role-permissions-hierarchy-diagram-dark.png#dark)

## Update Role Permission

Each role has their own set of permissions. On runtime, the engine will walk the role hierarchy and take the union of all permissions of the sub-graph.

The actions we can perform on resources. There are 4 basic permissions, `select`, `insert`, `update` and `delete`. You can define more for your application.

### Admin

![](../../static/img/rbac-role-permissions-admin.png#light)
![](../../static/img/rbac-role-permissions-admin-dark.png#dark)

### Manager

![](../../static/img/rbac-role-permissions-manager.png#light)
![](../../static/img/rbac-role-permissions-manager-dark.png#dark)

### Public

![](../../static/img/rbac-role-permissions-public.png#light)
![](../../static/img/rbac-role-permissions-public-dark.png#dark)
