# WindStore API SERVER

## Auth

POST /api/auth/register
Body: { username, email, password }

POST /api/auth/login  
Body: { username, password }

POST /api/auth/logout

GET /api/auth/me

## Products

GET /api/products
GET /api/products/category/:categoryName
GET /api/products/:slug
GET /api/shop?category=&brand=&search=&processor=
