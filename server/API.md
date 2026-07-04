# WindStore API Documentation

Base URL: `http://localhost:8000`

> All responses follow this format:
>
> ```json
> { "success": true/false, "data": {}, "message": "..." }
> ```
>
> Auth = cookie-based JWT. Login first, cookie is set automatically.

---

## Auth `/api/auth`

| Method | Endpoint             | Auth | Description                |
| ------ | -------------------- | ---- | -------------------------- |
| POST   | `/api/auth/register` | ❌   | Register new user          |
| POST   | `/api/auth/login`    | ❌   | Login & set cookie         |
| POST   | `/api/auth/logout`   | ✅   | Logout & clear cookie      |
| GET    | `/api/auth/me`       | ✅   | Get current logged in user |

### POST `/api/auth/register`

```json
{
  "username": "johndoe",
  "email": "john@gmail.com",
  "password": "123456"
}
```

### POST `/api/auth/login`

```json
{
  "username": "johndoe",
  "password": "123456"
}
```

Response includes user data. Cookie is set automatically.

---

## Products `/api/products`

| Method | Endpoint                               | Auth | Description                   |
| ------ | -------------------------------------- | ---- | ----------------------------- |
| GET    | `/api/products`                        | ❌   | Get all active products       |
| GET    | `/api/products/search?q=asus`          | ❌   | Search products (min 2 chars) |
| GET    | `/api/products/category/:categoryName` | ❌   | Get products by category name |
| GET    | `/api/products/:slug`                  | ❌   | Get product detail by slug    |
| GET    | `/api/products/:slug/reviews`          | ❌   | Get reviews for a product     |

### GET `/api/products/search`

Query params:

```
?q=asus         ← search by product name, brand, or category (min 2 chars)
```

Returns top 5 results with: `id, name, slug, imageUrl, basePrice, brand, category`

### GET `/api/products/:slug` Response includes:

- Product details
- `brand` (name)
- `productImages` (all images)
- `productFeatures` (title, description)
- `productConfigs` (id, configName, configType, priceModifier)
- `reviews` (rating, comment, createdAt, user.username)

---

## Shop `/api/shop`

| Method | Endpoint    | Auth | Description                        |
| ------ | ----------- | ---- | ---------------------------------- |
| GET    | `/api/shop` | ❌   | Get products + brands + processors |

### Query Params (all optional, combinable)

```
?category=Gaming
?brand=ASUS
?brand=ASUS&brand=Lenovo       ← multiple brands
?search=ROG
?processor=Intel
?processor=Intel&processor=AMD ← multiple processors
?priceMin=10000000
?priceMax=30000000
?sortBy=price-asc              ← price-asc, price-desc, newest
```

### Example Combined

```
GET /api/shop?category=Gaming&brand=ASUS&search=ROG&priceMin=10000000&sortBy=price-asc
```

### Response

```json
{
  "success": true,
  "data": {
    "brands": [{ "id": 1, "name": "ASUS" }],
    "processors": ["Intel Core i9-13980HX", "AMD Ryzen 9"],
    "products": [...]
  }
}
```

---

## Wishlist `/api/wishlist`

| Method | Endpoint        | Auth | Description                  |
| ------ | --------------- | ---- | ---------------------------- |
| GET    | `/api/wishlist` | ✅   | Get all wishlist items       |
| POST   | `/api/wishlist` | ✅   | Add product to wishlist      |
| DELETE | `/api/wishlist` | ✅   | Remove product from wishlist |

### POST `/api/wishlist`

```json
{ "productId": 1 }
```

### DELETE `/api/wishlist`

```json
{ "productId": 1 }
```

---

## Cart `/api/cart`

| Method | Endpoint             | Auth | Description                          |
| ------ | -------------------- | ---- | ------------------------------------ |
| GET    | `/api/cart`          | ✅   | Get all cart items                   |
| POST   | `/api/cart`          | ✅   | Add product to cart                  |
| PATCH  | `/api/cart/quantity` | ✅   | Update quantity (single or multiple) |
| DELETE | `/api/cart/item`     | ✅   | Remove one item                      |
| DELETE | `/api/cart`          | ✅   | Clear entire cart                    |

### POST `/api/cart`

```json
{
  "productId": 1,
  "configId": 1,
  "quantity": 1
}
```

`quantity` is optional, defaults to 1.

### PATCH `/api/cart/quantity` — Single item

```json
{
  "items": { "cartItemId": 5, "quantity": 3 }
}
```

### PATCH `/api/cart/quantity` — Multiple items at once

```json
{
  "items": [
    { "cartItemId": 5, "quantity": 3 },
    { "cartItemId": 8, "quantity": 1 }
  ]
}
```

### DELETE `/api/cart/item`

```json
{ "cartItemId": 1 }
```

---

## Orders `/api/orders`

| Method | Endpoint                | Auth | Description                           |
| ------ | ----------------------- | ---- | ------------------------------------- |
| GET    | `/api/orders`           | ✅   | Get all my orders                     |
| GET    | `/api/orders/:publicId` | ✅   | Get specific order by publicId (UUID) |

### GET `/api/orders` Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "publicId": "a3f29b1c-8e4d-4f21-9c3a-1b2e5f6d7a8c",
      "totalPrice": "25000000",
      "status": "pending",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "orderItems": [
        {
          "id": 1,
          "quantity": 1,
          "unitPrice": "25000000",
          "product": { "name": "ASUS ROG", "imageUrl": "..." },
          "productConfig": { "configName": "16GB / 1TB" }
        }
      ],
      "payments": [{ "status": "pending", "amount": "25000000" }]
    }
  ]
}
```

### Order Status Values

```
pending     → order created, waiting for payment
processing  → payment received, being processed
shipped     → on the way
delivered   → received by customer
cancelled   → cancelled
paid        → paid but not yet processed
```

---

## Payments `/api/payments`

| Method | Endpoint                       | Auth | Description                             |
| ------ | ------------------------------ | ---- | --------------------------------------- |
| POST   | `/api/payments/checkout`       | ✅   | Checkout & get Midtrans token           |
| POST   | `/api/payments/webhook`        | ❌   | Midtrans webhook (DO NOT CALL MANUALLY) |
| GET    | `/api/payments/:orderId/token` | ✅   | Get payment token for existing order    |

### POST `/api/payments/checkout`

```json
{
  "cartItems": [
    {
      "productId": 1,
      "configId": 1,
      "quantity": 1
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "token": "xxxx-xxxx-xxxx",
    "redirectUrl": "https://app.sandbox.midtrans.com/snap/..."
  }
}
```

### How FE Uses Midtrans Token

```typescript
window.snap.pay(token, {
  onSuccess: () => router.push(`/orders/${publicId}`),
  onPending: () => router.push(`/orders/${publicId}`),
  onClose: () => fetchOrder(),
  onError: () => toast.error("Payment failed"),
});
```

Add Midtrans script to `layout.tsx`:

```html
<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="{process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}"
/>
```

---

## Reviews `/api/reviews`

| Method | Endpoint                  | Auth | Description              |
| ------ | ------------------------- | ---- | ------------------------ |
| GET    | `/api/reviews/:productId` | ❌   | Get reviews by productId |
| POST   | `/api/reviews`            | ✅   | Add review               |
| PUT    | `/api/reviews/:id`        | ✅   | Update own review        |
| DELETE | `/api/reviews/:id`        | ✅   | Delete own review        |

### POST `/api/reviews`

```json
{
  "productId": 1,
  "rating": 4.5,
  "comment": "Great laptop!"
}
```

`rating` must be between 1-5. One review per product per user.

### PUT `/api/reviews/:id`

```json
{
  "rating": 5,
  "comment": "Even better than I thought!"
}
```

---

## Users `/api/users`

| Method | Endpoint        | Auth | Description        |
| ------ | --------------- | ---- | ------------------ |
| PUT    | `/api/users/me` | ✅   | Update own profile |
| DELETE | `/api/users/me` | ✅   | Delete own account |

### PUT `/api/users/me`

```json
{
  "username": "newusername",
  "email": "newemail@gmail.com"
}
```

### DELETE `/api/users/me`

No body needed. Will fail if user has active (pending/processing/shipped) orders.

---

## Categories `/api/categories`

| Method | Endpoint          | Auth | Description        |
| ------ | ----------------- | ---- | ------------------ |
| GET    | `/api/categories` | ❌   | Get all categories |

### Response

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Gaming" },
    { "id": 2, "name": "Business" },
    { "id": 3, "name": "Ultrabook" },
    { "id": 4, "name": "Creator" },
    { "id": 5, "name": "Budget" }
  ]
}
```

---

## Brands `/api/brands`

| Method | Endpoint      | Auth | Description    |
| ------ | ------------- | ---- | -------------- |
| GET    | `/api/brands` | ❌   | Get all brands |

---

## Product Configs `/api/configs`

| Method | Endpoint                  | Auth | Description               |
| ------ | ------------------------- | ---- | ------------------------- |
| GET    | `/api/configs/:productId` | ❌   | Get configs for a product |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "configName": "16GB / 1TB",
      "configType": "storage",
      "priceModifier": "0",
      "isDefault": true,
      "displayOrder": 1
    }
  ]
}
```

---

## Product Images `/api/images`

| Method | Endpoint                 | Auth | Description                  |
| ------ | ------------------------ | ---- | ---------------------------- |
| GET    | `/api/images/:productId` | ❌   | Get all images for a product |

---

## Product Features `/api/features`

| Method | Endpoint                   | Auth | Description                    |
| ------ | -------------------------- | ---- | ------------------------------ |
| GET    | `/api/features/:productId` | ❌   | Get all features for a product |

---

## Admin Routes `/api/admin` (Admin only)

> All admin routes require login as admin.
> `username: admin | password: admin123`

### Products

| Method | Endpoint                       | Auth     | Description                                          |
| ------ | ------------------------------ | -------- | ---------------------------------------------------- |
| GET    | `/api/admin/products`          | ✅ Admin | Get ALL products (including inactive)                |
| GET    | `/api/admin/products/create`   | ✅ Admin | Get brands + categories for create form              |
| GET    | `/api/admin/products/:id/edit` | ✅ Admin | Get product data + brands + categories for edit form |
| POST   | `/api/admin/products`          | ✅ Admin | Create product (multipart/form-data)                 |
| PUT    | `/api/admin/products/:id`      | ✅ Admin | Update product (multipart/form-data)                 |
| DELETE | `/api/admin/products/:id`      | ✅ Admin | Delete product                                       |

### POST/PUT `/api/admin/products` — Form Data (NOT JSON!)

```
name        : ASUS ROG Strix G16
brandId     : 1
categoryId  : 1
slug        : asus-rog-strix-g16
motto       : Dominate Every Game
description : High performance gaming laptop
basePrice   : 25000000
badge       : New
specs       : {"processor":"Intel i9","ram":"16GB","storage":"1TB"}
stock       : 10
isActive    : false
image       : [file upload]
```

> ⚠️ Use `multipart/form-data` NOT `application/json` — because of image upload!
> `specs` must be a JSON string

### Brands

| Method | Endpoint                | Auth     | Body                    | Description    |
| ------ | ----------------------- | -------- | ----------------------- | -------------- |
| GET    | `/api/admin/brands`     | ✅ Admin | -                       | Get all brands |
| POST   | `/api/admin/brands`     | ✅ Admin | `{ name, description }` | Create brand   |
| PUT    | `/api/admin/brands/:id` | ✅ Admin | `{ name, description }` | Update brand   |
| DELETE | `/api/admin/brands/:id` | ✅ Admin | -                       | Delete brand   |

### Categories

| Method | Endpoint                    | Auth     | Body       | Description        |
| ------ | --------------------------- | -------- | ---------- | ------------------ |
| GET    | `/api/admin/categories`     | ✅ Admin | -          | Get all categories |
| POST   | `/api/admin/categories`     | ✅ Admin | `{ name }` | Create category    |
| PUT    | `/api/admin/categories/:id` | ✅ Admin | `{ name }` | Update category    |
| DELETE | `/api/admin/categories/:id` | ✅ Admin | -          | Delete category    |

### Product Configs

| Method | Endpoint                 | Auth     | Body                                                              | Description   |
| ------ | ------------------------ | -------- | ----------------------------------------------------------------- | ------------- |
| POST   | `/api/admin/configs`     | ✅ Admin | `{ productId, configName, configType, priceModifier, isDefault }` | Create config |
| PUT    | `/api/admin/configs/:id` | ✅ Admin | `{ productId, configName, configType, priceModifier, isDefault }` | Update config |
| DELETE | `/api/admin/configs/:id` | ✅ Admin | -                                                                 | Delete config |

### Product Features

| Method | Endpoint                  | Auth     | Body                                | Description    |
| ------ | ------------------------- | -------- | ----------------------------------- | -------------- |
| POST   | `/api/admin/features`     | ✅ Admin | `{ productId, title, description }` | Create feature |
| PUT    | `/api/admin/features/:id` | ✅ Admin | `{ productId, title, description }` | Update feature |
| DELETE | `/api/admin/features/:id` | ✅ Admin | -                                   | Delete feature |

### Product Images

| Method | Endpoint                | Auth     | Description                                                         |
| ------ | ----------------------- | -------- | ------------------------------------------------------------------- |
| POST   | `/api/admin/images`     | ✅ Admin | Add image (multipart/form-data: `productId, isPrimary, image file`) |
| PUT    | `/api/admin/images/:id` | ✅ Admin | Update image `{ isPrimary, productId }`                             |
| DELETE | `/api/admin/images/:id` | ✅ Admin | Delete image                                                        |

### Users

| Method | Endpoint               | Auth     | Description                            |
| ------ | ---------------------- | -------- | -------------------------------------- |
| GET    | `/api/admin/users`     | ✅ Admin | Get all users with order/review counts |
| GET    | `/api/admin/users/:id` | ✅ Admin | Get specific user                      |
| DELETE | `/api/admin/users/:id` | ✅ Admin | Delete user                            |

### Reviews

| Method | Endpoint                 | Auth     | Description       |
| ------ | ------------------------ | -------- | ----------------- |
| DELETE | `/api/admin/reviews/:id` | ✅ Admin | Delete any review |

### Orders (Admin)

| Method | Endpoint                            | Auth     | Description                             |
| ------ | ----------------------------------- | -------- | --------------------------------------- |
| POST   | `/api/admin/orders/release-expired` | ✅ Admin | Manually release expired pending orders |

---

## Test Accounts

| Role     | Username  | Password   |
| -------- | --------- | ---------- |
| Admin    | `admin`   | `admin123` |
| Customer | `johndoe` | `user123`  |
| Customer | `janedoe` | `user123`  |

---

## Error Codes Reference

| HTTP Code | Meaning                                           |
| --------- | ------------------------------------------------- |
| 400       | Bad request — missing or invalid fields           |
| 401       | Unauthorized — not logged in                      |
| 403       | Forbidden — not enough permission (admin only)    |
| 404       | Not found                                         |
| 409       | Conflict — duplicate data or constraint violation |
| 429       | Too many requests — rate limited                  |
| 500       | Server error                                      |
