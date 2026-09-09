# FreshMart POS setup

## Prerequisites

Node.js 20+, npm, and MySQL 8+ (or Docker Desktop).

## Start MySQL

From the project root:

```bash
docker compose up -d mysql
```

The compose initialization imports `database/schema.sql` and `database/seed.sql`. For an existing MySQL instance, import those files manually.

## Start backend

```bash
cd backend
npm install
npm start
```

Set `DB_HOST=localhost`, `DB_USER=root`, `DB_PASS=`, and `DB_NAME=pos_supermarket` in `backend/.env` for XAMPP/phpMyAdmin persistence. Product prices and receipts use Zambian Kwacha (ZMW). With `DEMO_MODE=true`, the same REST contract runs from sample in-memory data.

## Start frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Use the demo accounts in the root README. The frontend calls `http://localhost:4000/api` by default; set `VITE_API_URL` to override it.

## Verify the flow

Login as cashier, add a product, apply a discount, select a payment method, and complete the sale. The backend validates stock, calculates totals, creates the payment, writes the sale, and decrements inventory atomically in MySQL. Login as manager to view reports and inventory.
