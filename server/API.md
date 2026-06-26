# WindStore API Documentation

Base URL: `http://localhost:8000`

---

## Auth `/api/auth`

| Method | Endpoint             | Auth | Body                            | Description                |
| ------ | -------------------- | ---- | ------------------------------- | -------------------------- |
| POST   | `/api/auth/register` | ❌   | `{ username, email, password }` | Register new user          |
| POST   | `/api/auth/login`    | ❌   | `{ username, password }`        | Login & set cookie         |
| POST   | `/api/auth/logout`   | ✅   | -                               | Logout & clear cookie      |
| GET    | `/api/auth/me`       | ✅   | -                               | Get current logged in user |

---

## Products `/api/products`

| Method | Endpoint                               | Auth | Body/Params           | Description                |
| ------ | -------------------------------------- | ---- | --------------------- | -------------------------- |
| GET    | `/api/products`                        | ❌   | -                     | Get all products           |
| GET    | `/api/products/category/:categoryName` | ❌   | `categoryName` in URL | Get products by category   |
| GET    | `/api/products/:slug`                  | ❌   | `slug` in URL         | Get product detail by slug |

---

## Shop `/api/shop`

| Method | Endpoint                                          | Auth | Query Params | Description                            |
| ------ | ------------------------------------------------- | ---- | ------------ | -------------------------------------- |
| GET    | `/api/shop`                                       | ❌   | -            | Get all products + brands + processors |
| GET    | `/api/shop?category=Gaming`                       | ❌   | `category`   | Filter by category                     |
| GET    | `/api/shop?brand=ASUS`                            | ❌   | `brand`      | Filter by brand                        |
| GET    | `/api/shop?search=ROG`                            | ❌   | `search`     | Search by product name                 |
| GET    | `/api/shop?processor=Intel`                       | ❌   | `processor`  | Filter by processor                    |
| GET    | `/api/shop?category=Gaming&brand=ASUS&search=ROG` | ❌   | combined     | Combine filters                        |

---

## Wishlist `/api/wishlist`

| Method | Endpoint        | Auth | Body            | Description                  |
| ------ | --------------- | ---- | --------------- | ---------------------------- |
| GET    | `/api/wishlist` | ✅   | -               | Get all wishlist items       |
| POST   | `/api/wishlist` | ✅   | `{ productId }` | Add product to wishlist      |
| DELETE | `/api/wishlist` | ✅   | `{ productId }` | Remove product from wishlist |

---

## Cart `/api/cart`

| Method | Endpoint         | Auth | Body                                 | Description               |
| ------ | ---------------- | ---- | ------------------------------------ | ------------------------- |
| GET    | `/api/cart`      | ✅   | -                                    | Get all cart items        |
| POST   | `/api/cart`      | ✅   | `{ productId, configId, quantity? }` | Add product to cart       |
| DELETE | `/api/cart/item` | ✅   | `{ cartItemId }`                     | Remove one item from cart |
| DELETE | `/api/cart`      | ✅   | -                                    | Clear entire cart         |

---

## Notes

- ✅ Auth required → must login first, cookie is set automatically
- ❌ No auth required → public endpoint
- `quantity` in cart is optional, defaults to 1 if not provided
- All responses follow this format:

```json
{
  "success": true/false,
  "data": {},
  "message": "..."
}
```

---

## Test Accounts (after running seed)

| Role     | Username  | Password   |
| -------- | --------- | ---------- |
| Admin    | `admin`   | `admin123` |
| Customer | `johndoe` | `user123`  |
| Customer | `janedoe` | `user123`  |
