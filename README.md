# WindStore

WindStore is a full-stack e-commerce platform for premium Windows laptops. Customers can browse laptops by category/brand/processor, pick a build configuration, save items to a wishlist, check out with real payment processing (Midtrans), and track their orders — while admins manage the full product catalog from a dedicated dashboard.

The project is a monorepo with two independently deployable apps:

```
windstore/
├── client/     # Next.js 16 (App Router) storefront + admin dashboard
└── server/     # Express + Prisma (PostgreSQL) REST API
```

Each app has its own README with setup details specific to it:

- [`client/README.md`](./client/README.md) — frontend setup, routes, environment variables
- [`server/README.md`](./server/README.md) — API reference, data model, environment variables

---

## Tech Stack

| Layer    | Stack                                                                                     |
| -------- | ------------------------------------------------------------------------------------------ |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Radix UI, Embla Carousel, Motion, Sonner (toasts) |
| Backend  | Node.js, Express 5, TypeScript, Prisma ORM (`@prisma/adapter-pg`)                          |
| Database | PostgreSQL                                                                                |
| Auth     | JWT stored in an `httpOnly` cookie, bcrypt password hashing                              |
| Payments | Midtrans Snap (sandbox/production)                                                        |
| Media    | Cloudinary (product image uploads via Multer, in-memory storage)                          |
| Jobs     | `node-cron` — auto-cancels stale unpaid orders and restocks their items                   |
| DevOps   | Docker + Docker Compose (optional, for containerized local development)                   |

## Features

**Storefront**
- Home page with hero, featured products, shop-by-category, and brand marquee
- Shop/catalog page with filtering by category, brand, processor, and price range, plus sorting and a live search bar in the navbar
- Product detail page with configuration picker (e.g. RAM/storage variants that change price), specs, and reviews
- Cart, multi-address checkout, and order history with live payment status
- Wishlist
- User profile: edit account, manage addresses, view order history, delete account

**Admin dashboard** (role-gated, `role: "admin"` only)
- Dashboard overview
- Products (create/edit/delete, image upload, feature list, configuration variants)
- Brands, Categories
- Reviews moderation
- User management

**Payments**
- Checkout creates an `Order` + `Payment` and opens a Midtrans Snap transaction
- Midtrans webhook verifies the request signature (SHA-512) and updates order/payment status
- A cron job periodically cancels orders left `pending` too long and restores stock

## Getting Started

You can run WindStore either natively (Node.js installed locally) or with Docker (no local Node.js/npm required). Pick whichever fits your workflow — both require the client and server running at the same time, since the client calls the server over HTTP.

### Option A — Native (Node.js)

#### 1. Database

Provision a PostgreSQL database (locally or hosted) and have its connection string ready for `server/.env`.

#### 2. Server

```bash
cd server
npm install
# create .env — see server/README.md for the full list of variables
npx prisma migrate dev
npm run dev
```

By default the API listens on `http://localhost:8000` (configurable via `PORT`).

#### 3. Client

```bash
cd client
npm install
# create .env.local — see client/README.md for the full list of variables
npm run dev
```

The storefront runs on `http://localhost:3000`, which is also the origin the server's CORS config expects (`credentials: true`).

#### 4. Create an admin user

New accounts register with `role: "customer"` by default. To access `/admin`, register a normal account and then promote it to `role: "admin"` directly in the database (there is no self-service admin signup).

### Option B — Docker

Docker Compose spins up both apps in containers, so you don't need Node.js or npm installed locally. You still need a PostgreSQL connection string and the rest of each app's environment variables — see `client/README.md` and `server/README.md`.

#### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/WindStore.git
cd WindStore
```

#### 2. Configure environment variables

Create `server/.env` and `client/.env.local` as described in each app's README before starting the containers.

#### 3. Start the project

```bash
docker compose up --build
```

#### 4. Open in browser

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

> **Note:** the ports above are for the Docker setup and differ from the native setup's `3000`/`8000`. When the client runs inside Docker, it should reach the server via the Docker network hostname (`http://server:5000/api`), **not** `localhost`.

#### 5. Stop the project

```bash
docker compose down
```

#### 6. Create an admin user

Same as the native setup: register a normal account, then promote it to `role: "admin"` directly in the database.

## Repository Notes

- The client and server are separate npm projects — install and run their dependencies independently.
- Prices are stored and transferred as integers (`BigInt` on the server) representing the smallest currency unit; the client is responsible for formatting/display.
- Cookies are used for auth (not `Authorization` headers), so the client always calls the API with `credentials: "include"`.
- Docker is optional — it's provided for contributors who want a consistent environment without installing Node.js locally. See the `docker-compose.yml`, `server/Dockerfile`, and `client/Dockerfile` for the container definitions.
