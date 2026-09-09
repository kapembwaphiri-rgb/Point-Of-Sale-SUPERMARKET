# FreshMart Supermarket POS

A demo-ready full-stack supermarket point-of-sale system with a React/Tailwind frontend, Express REST API, MySQL schema/seed data, role-based access, multi-method payments, and offline sale queuing.

## Project layout

- `frontend/` React + Tailwind UI (`src/components`, `src/pages`, `src/utils`)
- `backend/` Express API (`routes`, `controllers`, `models`, `middleware`, `config`)
- `database/` MySQL schema and sample data
- `docs/` setup, API, schema, usage, and architecture documentation

## Quick start

### 1. Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Run immediately in demo mode

Copy `backend/.env.example` to `backend/.env`. Leave `DEMO_MODE=true` for a zero-configuration demo. Then run:

```bash
npm run dev
```

Open <http://localhost:5173>.

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Cashier | cashier@freshmart.local | demo123 |
| Manager | manager@freshmart.local | demo123 |

### 3. Run with MySQL

Start MySQL and load the normalized schema and sample data:

```bash
docker compose up -d mysql
```

Update `backend/.env` with `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` values and set `DEMO_MODE=false`. The API will run on `http://localhost:4000` and the client on `http://localhost:5173`.

## Features included

- Cashier checkout with product search, quantity controls, promotions, receipt-ready completion, and cash/card/mobile-money/QR payment selection.
- Manager overview with sales totals, transaction count, low-stock count, and top-product signal.
- Manager inventory table with reorder indicators.
- JWT authentication and Cashier/Manager authorization.
- MySQL tables for users, products, inventory, sales, sale items, returns, payments, and discounts with foreign keys and indexes.
- Atomic MySQL checkout transaction: sale, items, payment, and inventory decrement commit together.
- Offline browser queue when network connectivity drops; queued payloads are stored in local storage for a later sync implementation.
- Input validation and consistent JSON error handling.
- Pattern evidence and architecture diagram in `docs/architecture.md`.

## Useful commands

```bash
npm run test      # API unit tests
npm run build     # React production build
npm run dev       # API + client together
```

## API surface

- `POST /api/auth/login`
- `GET /api/products?search=...`
- `POST /api/sales`
- `POST /api/returns`
- `GET /api/reports/summary` (Manager)
- `GET /api/health`

## Notes for production hardening

Set a long random `JWT_SECRET`, put the API behind HTTPS, add a proper refresh-token/session policy, connect receipt email/SMS providers, and replace the local queue with a durable IndexedDB queue plus a server idempotency key. Run `npm audit` before deployment; the current install reports two moderate server dependency advisories that should be reviewed with the lockfile in your deployment pipeline.
