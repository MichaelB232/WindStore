    # WindStore — Development Setup Guide

## Prerequisites

Make sure you have these installed:

- Node.js (v18+)
- Docker Desktop
- Git

---

## First Time Setup

### Step 1 — Clone the Project

```bash
git clone https://github.com/your-repo/windstore.git
cd windstore
```

### Step 2 — Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3 — Setup Environment Variables

#### Server (`server/.env`)

```bash
# Copy the example file
cp .env.example .env
```

Then fill in your values:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/windstore"
JWT_SECRET="your-random-secret-key-here"
PORT=8000

# Midtrans — get your own sandbox keys at dashboard.sandbox.midtrans.com
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

#### Client (`client/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
```

### Step 4 — Start Database

```bash
# From root folder
docker-compose up -d
```

### Step 5 — Run Migrations

```bash
cd server
npx prisma migrate dev
```

### Step 6 — Seed Database

```bash
npm run seed
```

### Step 7 — Start Development

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

---

## Midtrans Setup (Payment Gateway)

### Step 1 — Create Sandbox Account

1. Go to **dashboard.sandbox.midtrans.com**
2. Register for free
3. Login

### Step 2 — Get Your Keys

1. Go to **Settings** → **Access Keys**
2. Copy both keys:

```
Server Key : Mid-server-xxxxxxxxxx  ← goes in server/.env
Client Key : Mid-client-xxxxxxxxxx  ← goes in server/.env AND client/.env.local
```

### Step 3 — Add Keys to Environment

```bash
# server/.env
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# client/.env.local
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
```

---

## Ngrok Setup (Webhook Testing)

Ngrok exposes your local server to the internet so Midtrans can send webhook notifications.

### Step 1 — Install ngrok

```bash
npm install -g ngrok
```

### Step 2 — Create ngrok Account

1. Go to **ngrok.com**
2. Register for free
3. Go to **Dashboard** → **Your Authtoken**
4. Copy your auth token

### Step 3 — Add Auth Token

Run this once in any terminal:

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Step 4 — Run ngrok

Open a new terminal and run:

```bash
ngrok http 8000
```

You'll see:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8000
```

Copy that URL!

### Step 5 — Set Webhook URL in Midtrans

1. Go to **dashboard.sandbox.midtrans.com**
2. **Settings** → **Configuration**
3. Set Payment Notification URL:

```
https://abc123.ngrok-free.app/api/payments/webhook
```

4. Click **Save**

---

## Every Day Development Workflow

Open **3 terminals**:

```bash
# Terminal 1 — Database (run from root)
docker-compose up -d

# Terminal 2 — Backend
cd server
npm run dev

# Terminal 3 — ngrok (for payment webhook)
ngrok http 8000
```

Then open **1 more terminal** for frontend:

```bash
# Terminal 4 — Frontend
cd client
npm run dev
```

⚠️ **Important:** ngrok URL changes every time you restart it!
After restarting ngrok, update the webhook URL in Midtrans dashboard.

---

## Test Accounts (after seeding)

| Role     | Username  | Password   |
| -------- | --------- | ---------- |
| Admin    | `admin`   | `admin123` |
| Customer | `johndoe` | `user123`  |
| Customer | `janedoe` | `user123`  |

---

## Testing Payment Flow

### 1. Login

```
POST http://localhost:8000/api/auth/login
Body: { "username": "johndoe", "password": "user123" }
```

### 2. Checkout

```
POST http://localhost:8000/api/payments/checkout
Body:
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

### 3. Open Payment Page

Copy `redirectUrl` from response and open in browser.

### 4. Test Payment Credentials

**Credit Card:**

```
Card Number : 4811 1111 1111 1114
Expiry      : 01/25
CVV         : 123
OTP         : 112233
```

**GoPay / E-wallet:**

```
Just click Pay — auto success in sandbox!
```

### 5. Check Order Status

```
GET http://localhost:8000/api/orders/1
```

Status should update to "paid" automatically via webhook.

---

## Common Issues

### Database connection failed

```bash
# Make sure Docker is running
docker-compose up -d

# Check if container is running
docker ps
```

### Prisma client not generated

```bash
cd server
npx prisma generate
```

### Migrations not applied

```bash
cd server
npx prisma migrate dev
```

### ngrok closes immediately

```bash
# Make sure you added auth token first
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Payment webhook not received

- Make sure ngrok is running
- Make sure webhook URL is set in Midtrans dashboard
- ngrok URL must match exactly what's in Midtrans settings
- Check terminal for webhook logs

---

## Project Structure

```
WindStore/
├── client/                 ← Next.js frontend
│   ├── src/
│   └── .env.local
├── server/                 ← Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── lib/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── .env
├── docker-compose.yml
└── SETUP.md               ← you are here!
```

---

## API Documentation

See `API.md` for full list of endpoints.
