# WindStore

A full-stack e-commerce application built with React, Vite, Node.js, and Express.

## Project Structure

```text
WindStore/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── README.md
```

## Prerequisites

Make sure you have installed:

* Node.js (v18 or newer recommended)
* npm

Check your versions:

```bash
node -v
npm -v
```

---

## Clone the Repository

```bash
git clone https://github.com/MichaelB232/E-Commerce.git
cd E-Commerce
```

---

## Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

## Run the Backend

From the `server` directory:

```bash
npm run dev
```

The API will start on:

```text
http://localhost:5000
```

---

## Run the Frontend

Open a new terminal and navigate to the `client` directory:

```bash
cd client
npm run dev
```

The frontend will start on:

```text
http://localhost:5173
```

---

## Development Workflow

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd client
npm run dev
```

Keep both terminals running while developing.

---

## Environment Variables

If environment variables are required, create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
```

Do not commit `.env` files to Git.

---

## Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes

```bash
git add .
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

---

## Tech Stack

### Frontend

* React
* Vite

### Backend

* Node.js
* Express

### Version Control

* Git
* GitHub
