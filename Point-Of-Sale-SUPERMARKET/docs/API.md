# API reference

All protected endpoints use `Authorization: Bearer <JWT>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | API and mode health check |
| POST | `/api/auth/login` | Public | Returns JWT and user role |
| GET | `/api/products?search=` | Authenticated | Search products and inventory |
| POST | `/api/sales` | Authenticated | Complete sale and payment; decrements inventory |
| POST | `/api/returns` | Authenticated | Create a return/refund request |
| GET | `/api/reports/summary` | Manager | Daily sales and low-stock summary |

Sale body:

```json
{"items":[{"productId":"...","quantity":2}],"paymentMethod":"CARD","discountPercent":10,"reference":"terminal-ref"}
```

Payment methods are `CASH`, `CARD`, `MOBILE_MONEY`, and `QR`. Errors return `{ "error": "message" }` with a 4xx/5xx status.
