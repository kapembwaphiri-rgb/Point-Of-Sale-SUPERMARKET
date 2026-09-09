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

The normalized tables are `users`, `products`, `inventory`, `sales`, `sale_items`, `returns`, `payments`, and `discounts`. Foreign keys enforce product, user, sale, and payment relationships. `inventory.quantity` is updated in the same transaction as a MySQL sale.
