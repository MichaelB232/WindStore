# Product Requirements Document

## Custom Laptop E-Commerce — Configurator Store

**Version:** 1.0.0
**Date:** June 2026
**Status:** Draft
**Currency:** IDR (Indonesian Rupiah)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Tech Stack](#3-tech-stack)
4. [User Roles & Personas](#4-user-roles--personas)
5. [Functional Requirements](#5-functional-requirements)
   - 5.1 Authentication
   - 5.2 Catalog
   - 5.3 Configurator
   - 5.4 Cart & Checkout
   - 5.5 Orders & Saved Builds
   - 5.6 Admin Panel
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Database Schema](#7-database-schema)
8. [API Specification](#8-api-specification)
9. [Compatibility Engine](#9-compatibility-engine)
10. [UI/UX & Design System](#10-uiux--design-system)
11. [Animations & Motion](#11-animations--motion)
12. [Payment & Webhook Flow](#12-payment--webhook-flow)
13. [Security & Access Control](#13-security--access-control)
14. [Repo Structure](#14-repo-structure)
15. [Build Order](#15-build-order)
16. [Out of Scope (v1)](#16-out-of-scope-v1)

---

## 1. Overview

A portfolio-grade, full-stack e-commerce platform allowing users to configure a laptop part-by-part — selecting CPU, RAM, SSD, GPU, display, OS, and warranty — then purchase it via Stripe. The store features live price and compatibility feedback, an admin panel for catalog management, and a Stripe webhook-driven order flow.

### Problem Statement

Generic laptop stores offer fixed SKUs. Power users and enthusiasts want to customize individual components with instant feedback on compatibility and pricing. This product fills that gap with a guided, real-time configuration experience.

### Scope

| Area                                               | Included |
| -------------------------------------------------- | -------- |
| Frontend (Next.js App Router)                      | ✅       |
| Backend REST API (Express)                         | ✅       |
| Database (PostgreSQL via Prisma)                   | ✅       |
| Shared Compatibility Engine                        | ✅       |
| Stripe Checkout (test mode, IDR)                   | ✅       |
| Admin Panel                                        | ✅       |
| Animations (Framer Motion + MagicUI)               | ✅       |
| Real payments, multi-currency, email notifications | ❌ (v2)  |

---

## 2. Goals & Success Metrics

### Business Goals

- Demonstrate a production-grade, full-stack TypeScript application for portfolio purposes.
- Showcase real-world domain modeling: configurable products, slot rules, and a shared validation layer.
- Implement role-based access control and webhook-driven payment confirmation at a professional level.

### Success Metrics

| Metric                                            | Target                       |
| ------------------------------------------------- | ---------------------------- |
| Configurator renders with live price update       | < 100ms per selection        |
| Compatibility violations surface to user          | Instant (client-side engine) |
| Checkout session creation to Stripe redirect      | < 2s                         |
| Webhook order confirmation end-to-end             | < 5s after Stripe fires      |
| Admin CRUD operations (models, components, rules) | All covered                  |
| Mobile-responsive pages                           | All public pages             |

---

## 3. Tech Stack

| Layer            | Technology                                                                    |
| ---------------- | ----------------------------------------------------------------------------- |
| Frontend         | React 18, Next.js 14 (App Router), Tailwind CSS, shadcn/ui                    |
| Backend          | Node.js, Express (REST API)                                                   |
| Database         | PostgreSQL — Prisma ORM (recommended)                                         |
| Auth             | JWT — access token (15 min) + refresh token (7 days), httpOnly Secure cookies |
| Payments         | Stripe Checkout (test mode), IDR currency                                     |
| State Management | Zustand (cart), TanStack Query (server state)                                 |
| Animations       | Framer Motion, MagicUI components                                             |
| Shared Logic     | `packages/shared` — Zod schemas, compatibility engine, IDR formatter          |
| Deploy (later)   | Frontend: Vercel · Backend: Railway/Render/Fly · DB: Neon/Supabase/Railway    |

### Currency Helper (Single Source of Truth)

```ts
export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n); // → "Rp 12.500.000"
```

All prices stored as **integers** (bigint) in the database. All display formatting goes through `formatIDR`.

---

## 4. User Roles & Personas

### Roles

| Role       | Description                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| `guest`    | Unauthenticated visitor. Can browse, configure, and checkout (email only). Cart stored in localStorage. |
| `customer` | Registered and logged-in user. Can save builds, view order history, sync cart to DB.                    |
| `admin`    | Elevated role (separate `user_roles` table). Full access to admin panel.                                |

> **Security Note:** Roles are stored in a **separate `user_roles` table** — never on `users` or `profiles`. This prevents privilege escalation via profile editing.

### Personas

- **Enthusiast Buyer:** Wants to choose exact components, see compatibility instantly, and trust the final price shown.
- **Casual Buyer:** Wants a default configuration with an easy upgrade path.
- **Store Admin:** Needs to manage the catalog (models, components, rules) and monitor orders without touching code.

---

## 5. Functional Requirements

### 5.1 Authentication

| #       | Requirement                                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH-01 | Users can register with email + password. Password hashed with bcrypt (cost 12).                                                                  |
| AUTH-02 | Login returns access JWT (15 min) + refresh JWT (7 days) as httpOnly Secure cookies.                                                              |
| AUTH-03 | `/auth/refresh` issues a new access token using a valid refresh token.                                                                            |
| AUTH-04 | `/auth/logout` clears both cookies server-side.                                                                                                   |
| AUTH-05 | `/auth/me` returns current user ID, email, display name, and role. Cached client-side.                                                            |
| AUTH-06 | On 401, the frontend TanStack Query layer calls `/auth/refresh` once, retries the original request; if refresh fails, redirects to `/auth/login`. |
| AUTH-07 | Next.js `middleware.ts` checks the auth cookie and redirects unauthenticated users away from protected routes.                                    |

### 5.2 Catalog

| #      | Requirement                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| CAT-01 | Public endpoint `GET /models` returns a paginated list of active laptop base models (name, slug, base price, image). |
| CAT-02 | `GET /models/:slug` returns full model detail including all slots, slot options, and applicable compatibility rules. |
| CAT-03 | `GET /components` returns all active components with category, specs, price, and stock.                              |
| CAT-04 | Inactive models and components are hidden from public endpoints.                                                     |

### 5.3 Configurator

| #      | Requirement                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CFG-01 | Two-column layout: sticky left panel (laptop image + live summary), right panel (slot accordions).                                                                        |
| CFG-02 | Each slot displays option cards with name, specs chips, price delta (e.g., "+Rp 500.000"), and a stock badge.                                                             |
| CFG-03 | Selecting a component triggers live price recalculation and image crossfade.                                                                                              |
| CFG-04 | The shared compatibility engine runs client-side on every selection. Invalid options are dimmed with a tooltip explaining the violation.                                  |
| CFG-05 | "Add to Cart" is **disabled** until the configuration is valid and all required slots are filled.                                                                         |
| CFG-06 | Before adding to cart, the frontend calls `POST /configurator/validate` and waits for server confirmation. The client-side check is UX only; the server is the authority. |
| CFG-07 | Out-of-stock components are shown as disabled and cannot be selected.                                                                                                     |
| CFG-08 | The live summary shows: total price (with count-up animation), total wattage, total weight, and a validity banner.                                                        |

### 5.4 Cart & Checkout

| #       | Requirement                                                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CART-01 | Guests: cart stored in localStorage.                                                                                                                                           |
| CART-02 | Logged-in users: cart synced to the database. On login, guest cart is merged.                                                                                                  |
| CART-03 | Cart items display: model name, component summary, unit price (IDR), quantity, and a remove button.                                                                            |
| CHK-01  | Checkout prompts for email (guest) or uses account email (logged-in).                                                                                                          |
| CHK-02  | User enters Indonesian shipping address: provinsi, kota/kabupaten, kecamatan, kode pos.                                                                                        |
| CHK-03  | Frontend calls `POST /checkout/session`. Express re-validates each line item (price, stock, compatibility) before creating a Stripe Checkout Session.                          |
| CHK-04  | Stripe session is created in IDR. Each configured laptop is one line item: e.g., `"Aurora 14 Pro — i9 / 32GB / 1TB"`.                                                          |
| CHK-05  | After Stripe payment, the webhook `POST /webhooks/stripe` is the **only** source of truth for marking an order as `paid`. Stock is decremented atomically in a DB transaction. |
| CHK-06  | The success page polls `GET /orders/:id` until status = `paid`, then renders the confirmation.                                                                                 |
| CHK-07  | Test card: `4242 4242 4242 4242`.                                                                                                                                              |

### 5.5 Orders & Saved Builds

| #      | Requirement                                                                                |
| ------ | ------------------------------------------------------------------------------------------ |
| ORD-01 | Authenticated users can view order history at `/account`.                                  |
| ORD-02 | Each order shows: ID, date, status, items, and total IDR.                                  |
| BLD-01 | Authenticated users can save a configuration as a named build.                             |
| BLD-02 | Saved builds are listed at `/account/builds` and can be loaded back into the configurator. |

### 5.6 Admin Panel

All admin routes are gated behind `requireRole('admin')` middleware.

| #      | Requirement                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------- |
| ADM-01 | Dashboard: summary of recent orders, total revenue (IDR), and low-stock components.                                         |
| ADM-02 | Models CRUD: create, edit, activate/deactivate laptop base models. Manage slots (category, label, required, display order). |
| ADM-03 | Components CRUD: create, edit, set price (IDR), update stock, activate/deactivate.                                          |
| ADM-04 | Rules Builder: visual UI (dropdowns) to create and delete compatibility rules per model without editing JSON.               |
| ADM-05 | Orders: list all orders, view details, update order status (e.g., `processing → shipped → delivered`).                      |

---

## 6. Non-Functional Requirements

| Category           | Requirement                                                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Performance**    | Configurator price recalculation < 100ms. API responses (catalog) < 300ms (DB indexed).                                                                                                                                                                  |
| **Security**       | All JWT cookies are httpOnly + Secure + SameSite=Strict. Stripe webhook signature verified on every call. All request bodies validated with Zod before DB access. CORS restricted to frontend origin only. Auth and checkout endpoints are rate-limited. |
| **Reliability**    | Webhook handler is idempotent — replaying the same `payment_intent.succeeded` event does not double-decrement stock or double-mark an order.                                                                                                             |
| **Accessibility**  | All animations respect `prefers-reduced-motion`. Interactive elements have keyboard focus styles. Color contrast meets WCAG AA.                                                                                                                          |
| **Scalability**    | Database indexes on `orders.status`, `components.category`, `model_slots.model_id`.                                                                                                                                                                      |
| **Error Handling** | All API errors return `{ error: { code, message } }`. Frontend shows user-friendly toasts for API errors.                                                                                                                                                |
| **Mobile**         | All public-facing pages are responsive. Admin panel: desktop-first but not broken on tablet.                                                                                                                                                             |

---

## 7. Database Schema

```
users               id, email (unique), password_hash, created_at
user_roles          id, user_id, role ('admin' | 'customer')
profiles            user_id (pk/fk), display_name, avatar_url, phone

laptop_models       id, name, slug (unique), description,
                    base_price_idr (bigint), image_url, is_active, created_at

components          id, name, category, price_idr (bigint), stock (int),
                    specs (jsonb), image_url, is_active

model_slots         id, model_id (fk), category, label,
                    is_required (bool), min_qty, max_qty, display_order

slot_options        id, slot_id (fk), component_id (fk),
                    is_default (bool), price_override_idr (bigint, nullable)

compatibility_rules id, model_id (fk),
                    rule_type ('requires' | 'forbids' | 'max_sum' | 'max_qty'),
                    condition (jsonb), message (text)

orders              id, user_id (fk, nullable), email, status,
                    total_idr (bigint), stripe_session_id,
                    shipping_address (jsonb), created_at

order_items         id, order_id (fk), model_id (fk),
                    configuration (jsonb), unit_price_idr (bigint), quantity

saved_builds        id, user_id (fk), model_id (fk), name,
                    configuration (jsonb), created_at
```

**Notes:**

- Prices stored as integers (bigint). IDR has no decimal places.
- Roles in a **separate table** — never colocated with `users` or `profiles`.
- Use Prisma migrations or plain SQL files under `api/db/migrations/`.
- Index `orders.status`, `components.category`, `model_slots.model_id` for query performance.

---

## 8. API Specification

### Auth — `/auth`

| Method | Path             | Auth           | Description                  |
| ------ | ---------------- | -------------- | ---------------------------- |
| POST   | `/auth/register` | —              | Register user, return tokens |
| POST   | `/auth/login`    | —              | Login, return tokens         |
| POST   | `/auth/refresh`  | refresh cookie | Issue new access token       |
| POST   | `/auth/logout`   | —              | Clear cookies                |
| GET    | `/auth/me`       | access token   | Return current user + role   |

### Catalog — `/catalog`

| Method | Path            | Auth | Description                         |
| ------ | --------------- | ---- | ----------------------------------- |
| GET    | `/models`       | —    | Paginated list of active models     |
| GET    | `/models/:slug` | —    | Model detail: slots, options, rules |
| GET    | `/components`   | —    | All active components               |

### Configurator — `/configurator`

| Method | Path                     | Auth | Description                                  |
| ------ | ------------------------ | ---- | -------------------------------------------- |
| POST   | `/configurator/validate` | —    | Server-side compatibility + price validation |

### Orders — `/orders`

| Method | Path          | Auth     | Description                           |
| ------ | ------------- | -------- | ------------------------------------- |
| GET    | `/orders`     | customer | List user's orders                    |
| GET    | `/orders/:id` | customer | Order detail (polled by success page) |

### Checkout — `/checkout`

| Method | Path                | Auth     | Description                    |
| ------ | ------------------- | -------- | ------------------------------ |
| POST   | `/checkout/session` | optional | Create Stripe Checkout Session |

### Webhooks — `/webhooks`

| Method | Path               | Auth             | Description                       |
| ------ | ------------------ | ---------------- | --------------------------------- |
| POST   | `/webhooks/stripe` | Stripe signature | Handle `payment_intent.succeeded` |

### Admin — `/admin` (role=admin required)

| Method              | Path                | Description                 |
| ------------------- | ------------------- | --------------------------- |
| GET/POST/PUT/DELETE | `/admin/models`     | CRUD laptop models          |
| GET/POST/PUT/DELETE | `/admin/components` | CRUD components + stock     |
| GET/POST/DELETE     | `/admin/rules`      | CRUD compatibility rules    |
| GET/PATCH           | `/admin/orders`     | List + update order status  |
| GET                 | `/admin/dashboard`  | Revenue + low-stock summary |

---

## 9. Compatibility Engine

Located in `packages/shared/configurator/`. Pure functions — no side effects. Runs identically on the frontend (live UX) and backend (`/configurator/validate`).

### Rule Types

```ts
type Rule =
  | { type: "requires"; if: ComponentId; then: ComponentId }
  | { type: "forbids"; if: ComponentId; with: ComponentId }
  | { type: "max_sum"; field: "wattage"; categories: Category[]; max: number }
  | { type: "max_qty"; category: Category; max: number };
```

### Validate Function

```ts
function validate(
  config: Record<SlotId, ComponentId[]>,
  rules: Rule[],
): { valid: boolean; violations: Violation[] };
```

- `requires` — if component A is selected, component B must also be selected.
- `forbids` — component A and component B cannot be selected together.
- `max_sum` — the sum of a numeric spec field (e.g., wattage) across selected components in given categories must not exceed `max`.
- `max_qty` — no more than `max` components of a given category can be selected.

### Admin Rule Builder

The admin UI builds rules via dropdowns (component A → relation → component B / value). Rules are persisted to `compatibility_rules` as JSON. No manual JSON editing is needed.

---

## 10. UI/UX & Design System

### Visual Style

| Token      | Value                                                             |
| ---------- | ----------------------------------------------------------------- |
| Background | `#FAFAFA`                                                         |
| Text       | `#0A0A0A`                                                         |
| Accent     | `#4F46E5`                                                         |
| Border     | Neutral gray                                                      |
| Font       | Inter (tight tracking for headings, comfortable body line-height) |
| Radius     | 8px                                                               |
| Shadow     | Soft / medium elevation                                           |

### Component Library

shadcn/ui defaults with generous padding. Photography: clean laptop renders on neutral backgrounds.

### Pages & Routes

**Public**

| Route               | Description         |
| ------------------- | ------------------- |
| `/`                 | Landing page        |
| `/laptops`          | Grid of base models |
| `/laptops/[slug]`   | Configurator        |
| `/cart`             | Cart review         |
| `/checkout`         | Shipping + payment  |
| `/checkout/success` | Order confirmation  |
| `/auth/login`       | Login               |
| `/auth/register`    | Register            |

**Authenticated**

| Route             | Description             |
| ----------------- | ----------------------- |
| `/account`        | Profile + order history |
| `/account/builds` | Saved configurations    |

**Admin (role=admin)**

| Route               | Description                   |
| ------------------- | ----------------------------- |
| `/admin`            | Dashboard                     |
| `/admin/models`     | CRUD models + slots           |
| `/admin/components` | CRUD components + stock       |
| `/admin/rules`      | Compatibility rules per model |
| `/admin/orders`     | View + update order status    |

---

## 11. Animations & Motion

All animations use Framer Motion + MagicUI. All animations must respect `prefers-reduced-motion`.

| Page / Component       | Animation                                                                                                                                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing hero**       | Headline words fade up in sequence (Aurora Text / Text Animate). Subheadline blur-fades in. CTA = Shimmer Button. Grid Pattern or Particles background. Feature sections reveal on scroll (Blur Fade, 80ms stagger). |
| **Laptops grid**       | Cards stagger-fade from below (50ms delay each). Hover lifts card with scale + shadow. Image gently zooms inside card.                                                                                               |
| **Configurator**       | Laptop image crossfades on component change. Price count-up animation. Accordion smooth height + opacity. Selecting an option pulses a checkmark. Invalid options fade-dim + shake on click attempt.                 |
| **Cart**               | Line items slide in from right. Remove = slide out + height collapse.                                                                                                                                                |
| **Page transitions**   | Every route fades + slides up 8px on mount (200ms).                                                                                                                                                                  |
| **Micro-interactions** | Buttons hover-scale 1.02. Story-link underline grow. Success toasts scale-in.                                                                                                                                        |

---

## 12. Payment & Webhook Flow

```
User clicks Checkout
   ↓
Enter email (guest) or use account email
   ↓
Enter Indonesian shipping address
   ↓
Frontend → POST /checkout/session
   ↓
Express re-validates: price + stock + compatibility
   ↓
Creates Stripe Checkout Session (IDR)
   ↓
Frontend redirects → Stripe Checkout page
   ↓
User pays with test card 4242 4242 4242 4242
   ↓
Stripe fires POST /webhooks/stripe
   ↓
Express verifies Stripe signature
   ↓
DB transaction: mark order = paid + decrement stock
   ↓
Success page polls GET /orders/:id until status = paid
   ↓
Renders order confirmation
```

> **Critical:** The webhook is the **only** source of truth for order payment status. The Stripe success redirect is informational only and must never trigger order fulfillment logic.

---

## 13. Security & Access Control

| Control                | Implementation                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| Password hashing       | bcrypt, cost factor 12                                                                          |
| JWT storage            | httpOnly, Secure, SameSite=Strict cookies                                                       |
| Role enforcement       | Separate `user_roles` table; never on `users` or `profiles`                                     |
| Route guard (frontend) | Next.js `middleware.ts` — checks auth cookie, redirects                                         |
| Route guard (backend)  | `requireAuth` middleware (verify JWT) → `requireRole('admin')` for admin routes                 |
| Input validation       | Zod on every request body and route param before DB access                                      |
| CORS                   | Restricted to frontend origin; `credentials: true`                                              |
| Rate limiting          | Applied to `/auth/*` and `/checkout/*` endpoints                                                |
| Stripe webhook         | Raw body parsing; `stripe.webhooks.constructEvent` signature verification                       |
| Idempotency            | Webhook handler checks existing order status before processing to prevent duplicate fulfillment |

---

## 14. Repo Structure

```
laptop-store/
  apps/
    web/              # Next.js frontend (App Router)
    api/              # Express backend
  packages/
    shared/           # Shared types, Zod schemas, compatibility engine, formatIDR
      configurator/   # validate(), Rule types, Violation types
      schemas/        # Zod schemas used by both apps
      utils/          # formatIDR and other pure helpers
```

### Backend Layout

```
api/
  src/
    index.ts                    # Express app bootstrap
    middleware/                 # auth, error handler, rate limit, Zod validation
    modules/
      auth/                     # /auth/*
      catalog/                  # /models, /components
      configurator/             # /validate
      cart/                     # logged-in users
      orders/                   # /orders, /orders/:id
      checkout/                 # /checkout/session
      admin/                    # /admin/* — role-gated
      webhooks/                 # /webhooks/stripe
  db/
    schema.prisma               # Prisma schema
    migrations/                 # Migration files
    seed.ts                     # Seed: 2–3 models, ~20 components, rules (IDR prices)
```

---

## 15. Build Order

This is the recommended implementation sequence to minimize integration pain.

| Phase  | Description                                                                                |
| ------ | ------------------------------------------------------------------------------------------ |
| **1**  | Init monorepo + Tailwind + shadcn/ui + Express skeleton + Postgres + Prisma                |
| **2**  | Database schema + migrations + seed script (2–3 models, ~20 components, rules, IDR prices) |
| **3**  | Auth module (register / login / refresh / me) + role middleware                            |
| **4**  | Catalog endpoints + frontend: landing page, laptop grid, laptop detail (read-only)         |
| **5**  | Configurator interactivity + shared compatibility engine + `/validate` endpoint            |
| **6**  | Cart (localStorage for guests, synced to DB after login, merge on login)                   |
| **7**  | Checkout + Stripe integration + webhook handler + order persistence                        |
| **8**  | Account pages (order history, saved builds)                                                |
| **9**  | Admin panel (models → components → rules → orders)                                         |
| **10** | Animations pass, empty / loading / error states, SEO meta per route, 404 page              |

---

## 16. Out of Scope (v1)

| Feature                         | Notes                               |
| ------------------------------- | ----------------------------------- |
| Real payments                   | Stripe test mode only               |
| Multi-language / multi-currency | IDR only                            |
| Product reviews & ratings       | v2                                  |
| Email notifications             | Add later via Resend or Nodemailer  |
| Advanced inventory management   | Simple stock integer decrement only |
| Shipping cost calculation       | Flat fee or free shipping for v1    |

---

## Appendix A — Seed Data Outline

| Model           | Base Price (IDR) |
| --------------- | ---------------- |
| Aurora 14 Pro   | Rp 12.000.000    |
| Nova 15 Creator | Rp 18.500.000    |
| Apex 16 Gaming  | Rp 22.000.000    |

Seed includes ~20 components across categories: CPU, RAM, SSD, GPU, Display, OS, Warranty. Each model has at least one `requires` rule and one `max_sum` wattage rule. All prices in integers (IDR, no decimals).

---

## Appendix B — CV / Portfolio Talking Points

- **Full-stack TypeScript** — Next.js 14 (App Router) + Express
- **Real domain modeling** — configurable products, slot rules, compatibility engine
- **Shared validation** — same Zod schemas and engine run client-side (UX) and server-side (security)
- **Role-based access control** — separate `user_roles` table, prevents privilege escalation
- **Webhook-driven payment** — server never trusts redirect; webhook is the only fulfillment trigger
- **Animated, accessible UI** — Framer Motion + MagicUI, `prefers-reduced-motion` respected throughout
- **Production-grade patterns** — idempotent webhook handler, httpOnly JWT cookies, Zod-validated API layer

---

_End of Document — v1.0.0_
