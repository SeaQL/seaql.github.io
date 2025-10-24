# Considerations

Authorization is a broad topic, and there is no single "right" way to implement it.

The best approach depends on the needs of your application, the sensitivity of the data you expose, and the types of users you serve.
Seaography gives you the flexibility to apply different strategies, individually or in combination, to achieve the level of control you require.

## Schema‑level restrictions
If certain data should never be exposed, the simplest and strongest option is to remove it from the GraphQL schema entirely.
By omitting entities, fields, or mutations, you ensure that clients cannot query them at all.
This is the most secure approach when access is not needed under any circumstance.

## Role‑based access control (RBAC)
For applications such as **admin portals or back‑office tools**, access is often determined by user roles (e.g. *admin*, *editor*, *viewer*).  

At runtime, Seaography can evaluate these policies before resolving queries or mutations.

- **Deny by default** - only explicitly granted actions are allowed.  
- **Role assignments** - attach roles to principals (users, API keys, tenants).  
- **Role hierarhy** - roles can be inherited.

Combining RBAC with Entity Filters, it lets you implement rules such as "admins can update any post", "viewer is read-only", "users can only update their own posts".

## Ownership‑based access
For **end‑user facing applications**, resources often have an *owner* (e.g. a user's own posts, orders, or profile).  
In these cases, you can enforce access by:
- Adding **Filters** to queries so users only see their own data.
- Using **Guards** on queries / mutations to ensure a user can only read, update or delete resources they own.

This pattern is common in SaaS where each user should only interact with their own records.

## Service‑level separation
In more complex systems, you may choose to split responsibilities across **multiple microservices**.  
For example:
- A dedicated service for public, read‑only queries.  
- A separate service for administrative operations.  
- Another service for sensitive, user‑owned data.  

This separation can simplify reasoning about access rules and reduce the blast radius of misconfiguration.

## Layering strategies
These strategies are not mutually exclusive. In fact, combining them often yields the strongest security setup:
- **Schema restrictions** to hide what should never be exposed.  
- **RBAC** to differentiate between classes of users.  
- **Filters** to ensure ownership.
- **Guards** to double check / enforce rules.

By layering these approaches, you can tailor Seaography's authorization model to match both your security requirements and your application's complexity.

## Professional Support

If you need technical advice and support, you’re welcome to [consult with SeaQL.org](mailto:hello@sea-ql.org). Our team can help you adopt and unlock the full potential of the Rust + SeaQL ecosystem by providing expert consulting to support your software development.
