# WindStore API

## Auth

POST /api/auth/register
Body: { username, email, password }

POST /api/auth/login  
Body: { username, password }

## Products

GET /api/products
GET /api/products/category/:categoryName
GET /api/products/:slug
GET /api/shop?category=&brand=&search=&processor=
