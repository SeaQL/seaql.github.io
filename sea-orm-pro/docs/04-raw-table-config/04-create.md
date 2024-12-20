# Create

## Enable Create

* Is create enabled in the admin dashboard?

## Hidden Columns

* Columns that are hidden on the create form

## Full Spec

```toml
[create]

# Is create allowed for this table?
enable = true

# List of columns that are hidden on the create form
hidden_columns = [
    "created_at",
    "updated_at",
]
```
