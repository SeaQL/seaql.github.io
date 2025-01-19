```graphql
query {
  customer(
    order_by: { customer_id: ASC }
    pagination: { page: { limit: 10, page: 0 } }
  ) {
    nodes {
      customer_id
      title
      first_name
      middle_name
      last_name
    }
    pagination_info {
      current
      pages
      offset
      total
    }
  }
}
```