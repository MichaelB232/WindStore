# WindStore — Client

Next.js (App Router) storefront and admin dashboard for WindStore. Talks to the [server](../server/README.md) over HTTP with cookie-based auth.

> See the [root README](../README.md) for how this fits together with the server.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, `shadcn/ui`, Radix UI primitives, `class-variance-authority`, `tailwind-merge`
- **UI extras:** Embla Carousel (product/brand carousels), Motion (animations), `lucide-react` (icons), Sonner (toasts)
- **Fonts:** Geist Sans/Mono + Bricolage Grotesque (via `next/font/google`)
- **Payments:** Midtrans Snap.js loaded client-side

## Getting Started

```bash
npm install
```

### 1. Environment variables

Create a `.env.local` file in `client/`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

| Variable                              | Required | Notes |
| --------------------------------------- | -------- | ----- |
| `NEXT_PUBLIC_API_URL`                  | **Yes**  | Base URL of the [server](../server/README.md); every service module builds requests from this |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`      | **Yes**, for checkout | Public Midtrans client key, passed to the Snap.js `<script>` tag |
| `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`  | No       | `"true"` loads `app.midtrans.com`'s Snap.js instead of the sandbox one |

All API calls must be made with cookies included (the app's `fetch` wrappers already do this) since auth is a `httpOnly` cookie, not a bearer token — and the server's CORS is currently locked to `http://localhost:3000`.

### 2. Run

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
npm run lint
```

## Project Structure

```
src/
├── app/                       # Next.js App Router routes (see Routing below)
├── components/                # UI components, grouped by feature/page
│   ├── layout/                # Navbar, Footer, Container
│   ├── main/                  # Homepage sections
│   ├── shop/                  # Catalog/filter UI
│   ├── laptop/                # Product detail page
│   ├── cart/, checkout/, order/, wishlist/, address/, profile/, auth/
│   ├── admin/                 # Admin dashboard UI
│   └── ui/shadcn/, ui/alert/  # Design-system primitives
├── services/                  # One folder per API resource: fetch wrappers + (for auth/cart/wishlist) React Context
├── hooks/                     # useAuth, useDebounce, useMidtransSnap
├── lib/                       # Shared types (ProductType, AdminType), cart stock helpers, utils
└── routes/
    ├── routes.tsx              # ROUTES — storefront path constants
    └── adminRoutes.ts          # ADMIN_ROUTES — admin path constants
```

Always import paths from `ROUTES` / `ADMIN_ROUTES` rather than hardcoding strings — that's the single source of truth the whole app (including the footer/navbar) is wired to.

## Routing

Route groups mirror access level:

| Group          | Layout behavior | Routes |
| --------------- | ---------------- | ------ |
| `(main)`        | Public — `Navbar` + page + `Footer` | `/` (home), `/shop`, `/laptop/[slug]` |
| `(auth)`        | Public, auth-only pages | `/login`, `/register` |
| `(protected)`   | Client-side redirect to `/login` if not authenticated (checked via `useAuth`) | `/cart`, `/checkout`, `/orders`, `/orders/[publicId]`, `/wishlist`, `/profile`, `/profile/order-history`, `/profile/setting` |
| `(admin)`       | Client-side redirect if not authenticated **and** `role !== "admin"`; renders `AdminSidebar` | `/admin`, `/admin/products` (+`/new`, `/[id]/edit`), `/admin/brands`, `/admin/categories`, `/admin/configs`, `/admin/reviews`, `/admin/users` |

Note that `(protected)` and `(admin)` guard on the client (via `useEffect` + `useAuth`), not via middleware — the pages briefly render a loading state before redirecting rather than being blocked at the edge.

### Shop filters

`/shop` reads filters straight from the URL query string and forwards them to the server's `/api/shop` endpoint: `category`, `brand` (comma-separated), `processor` (comma-separated), `search`, `priceMin`, `priceMax`, `sortBy`. `CatalogClient` keeps this in sync both ways — changing a filter in the sidebar updates the URL via `router.replace`, so filtered views are shareable/bookmarkable links, e.g. `/shop?category=Gaming&sortBy=price-asc`.

## State Management

There's no global store (Redux/Zustand) — state is split between server data fetched per-request and a few small React Contexts (all under `src/services/*/context`), provided in `app/layout.tsx`:

- **`AuthProvider`** — fetches `/api/auth/me` on mount, exposes `user`, `loading`, `refreshUser`, `logout`. Everything that needs to know "am I logged in / am I admin" reads this via `useAuth()`.
- **`WishlistProvider`** — syncs the logged-in user's wishlist product ids into a `Set` so any product card can show a filled/empty heart without an extra request per card.
- **`CartSelectionProvider`** — purely client-side (not persisted to the server): tracks which cart line items are checked for checkout. Resets automatically when the logged-in user changes.

Everything else (products, orders, addresses, reviews, admin data) is fetched directly from the corresponding `services/<resource>/<resource>.service.ts` module — thin `fetch` wrappers around the server API, no client-side caching layer.

## Payments (client side)

`useMidtransSnap()` (in `src/hooks`) injects the Midtrans Snap.js script (sandbox or production URL depending on `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`) and exposes a `pay(token, callbacks)` function. The typical flow:

1. Checkout page calls the server's `POST /api/payments/checkout` and receives a Snap `token`.
2. `pay(token, { onSuccess, onPending, onError, onClose })` opens the Midtrans popup.
3. Order status is then confirmed by polling/viewing `/orders/[publicId]`, which reflects whatever the server's webhook handler last set (the client does not trust the Snap callback alone for final status).

## Admin Dashboard

Gated to `role === "admin"` (checked client-side, see Routing above). Covers:

- **Products** — list, create, edit (with image upload, feature list, and configuration/variant management), delete
- **Brands**, **Categories** — CRUD
- **Configs** — product configuration variants (e.g. RAM/storage options with a price modifier)
- **Reviews** — moderation (delete)
- **Users** — list, delete

All admin data calls go through `src/services/admin/admin.service.ts`, which targets the server's `/api/admin/*` routes.

## Conventions

- **Prices** are transferred from the server as strings (server-side `BigInt`, representing the smallest currency unit) — format them for display in the client rather than assuming a `number`.
- **Categories/brands are dynamic**, not hardcoded — always fetched from the server (`getAllProduct()` / brand service) so admin-created categories show up everywhere automatically (homepage, shop filters, footer, etc.). Don't hardcode a list of category names in a new component.
- **Styling tokens** live in `src/app/globals.css` as CSS custom properties (`--color-accent`, `--color-dark`, `--radius-lg`, etc.) consumed via Tailwind arbitrary-value classes like `bg-[--color-dark]`, or via the plain utility classes Tailwind generates from `@theme inline` (`bg-dark`, `text-accent`, ...). Prefer existing tokens over introducing new hardcoded colors.
