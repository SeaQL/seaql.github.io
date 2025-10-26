# Entity / Field Guards

Entity / Field Guards are part of the lifecycle hooks. Guards can be used to restrict access on models or individual items.

Note that once a guard is triggered, the request will be denied and an error message is returned.

```rust
BuilderContext {
    hooks: LifecycleHooks::new(AccessControlGuard),
    ..Default::default()
}
```

You can define a struct and implement the `LifecycleHooksInterface`:

```rust
struct AccessControlGuard;

#[async_trait::async_trait]
impl LifecycleHooksInterface for AccessControlGuard {
    fn entity_guard(
        &self,
        ctx: &ResolverContext,
        entity: &str,
        action: OperationType,
    ) -> GuardAction {
        match entity {
            "FilmCategory" => GuardAction::Block(None),
            _ => GuardAction::Allow,
        }
    }

    fn field_guard(
        &self,
        ctx: &ResolverContext,
        entity: &str,
        field: &str,
        action: OperationType, // ⬅ Read, Create, Update, Delete
    ) -> GuardAction {
        match (entity, field, action) {
            // ⬇ block all access on a field
            ("Language", "lastUpdate", _) => GuardAction::Block(None),
            // ⬇ block only update on a field
            ("Language", "name", OperationType::Update) => GuardAction::Block(None),
            // ⬇ custom logic based on context and object value
            ("Actor", _, _) => {
                let permissions = ctx.data::<Permissions>().unwrap();
                //  ⬆ extract permission from context

                let Some(actor) = ctx.parent_value.downcast_ref::<actor::Model>() else {
                    return GuardAction::Block(Some("downcast_ref failed".into()));
                };

                if permissions.actors.contains(&actor.actor_id) {
                    // based on context, this user is allowed to access this Actor
                    GuardAction::Allow
                } else {
                    // a custom error message
                    GuardAction::Block(Some(format!("{action:?} on actor {} denied", actor.actor_id)))
                }
            }
            _ => GuardAction::Allow,
        }
    }
}
```

The `OperationType` enum covers CRUD:

```rust
pub enum OperationType {
    Read,
    Create,
    Update,
    Delete,
}
```
