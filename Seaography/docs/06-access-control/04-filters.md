# Fine-grained Filters

While guards can be used to protect resources, it's not useful in endpoints for listing resources. For this purpose you can use entity filter.

Imagine you have a drawing app, and users can only access projects they own. You can implement the access control logic like the following:

```rust
struct AccessControlHook;

impl LifecycleHooksInterface for AccessControlHook {
    fn entity_filter(
        &self,
        ctx: &ResolverContext,
        entity: &str,
        action: OperationType, // ⬅ Read, Create, Update, Delete
    ) -> Option<Condition> {
        let session = ctx.data::<Session>()?;
        //  ⬆ extract user session
        match entity {
            "Project" => Some(
                Condition::all()
                    .add(project::Column::OwnerId.eq(session.user_id))
                //  ⬆ add custom filter condition
            ),
            _ => None,
        }
    }
}
```

This method is called on Read, Create, Update, Delete. So you can apply conditional logic based on operation performed and other information from context.