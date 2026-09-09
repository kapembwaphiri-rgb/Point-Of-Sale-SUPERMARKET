# Database schema

```mermaid
erDiagram
  USERS ||--o{ SALES : cashier
  SALES ||--|{ SALE_ITEMS : contains
  PRODUCTS ||--o| INVENTORY : stocked
  PRODUCTS ||--o{ SALE_ITEMS : sold
  SALES ||--o{ PAYMENTS : paid_by
  SALES ||--o{ RETURNS : may_have
  USERS ||--o{ RETURNS : processes
  DISCOUNTS {
    char id PK
    varchar name
    enum type
    decimal value
  }
```

The normalized tables are `users`, `products`, `inventory`, `sales`, `sale_items`, `returns`, `payments`, and `discounts`. Foreign keys enforce product, user, sale, and payment relationships. `products.stock_quantity` is the API-facing stock field and is kept synchronized with `inventory.quantity` in the same MySQL transaction. Sales decrement both fields; validated returns increment both fields.

For an existing XAMPP/phpMyAdmin database, run `database/migration_stock_quantity.sql` once after the original schema. New installations can use `database/schema.sql` followed by `database/seed.sql`.
