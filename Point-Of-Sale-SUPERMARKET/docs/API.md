# API reference

All protected endpoints use `Authorization: Bearer <JWT>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | API and mode health check |
| POST | `/api/auth/login` | Public | Returns JWT and user role |
| GET | `/api/products?search=` | Authenticated | Search products and return `stock_quantity`/`quantity` and reorder level |
| POST | `/api/sales` | Authenticated | Complete sale and payment; decrements inventory |
| POST | `/api/returns` | Authenticated | Return sold items and increment inventory |
| GET | `/api/reports/summary` | Manager | Daily sales and low-stock summary |

Sale body:

```json
{"items":[{"productId":"...","quantity":2}],"paymentMethod":"CARD","discountPercent":10,"reference":"terminal-ref"}
```

Payment methods are `CASH`, `CARD`, `MOBILE_MONEY`, and `QR`. Errors return `{ "error": "message" }` with a 4xx/5xx status.

Return body:

```json
{"saleId":"...","reason":"Damaged item","items":[{"productId":"...","quantity":1}]}
```

Both sale and return responses include a `stock` array with the affected `productId` and current `stockQuantity`. In MySQL mode, `products.stock_quantity` and `inventory.quantity` are updated together in the transaction.
