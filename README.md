# 🐳 WindStore

A full-stack e-commerce application built with:

- ⚛️ React + TypeScript (Vite)
- 🚀 Node.js + Express
- 🐳 Docker + Docker Compose

---

# 📦 Project Structure

```text id="s1"
WindStore/
├── client/        # React + TypeScript frontend
├── server/        # Express backend
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Requirements

Before running this project, install:

- [Docker Desktop](https://www.docker.com/products/docker-desktop?utm_source=chatgpt.com)

No need to install Node.js or npm manually.

---

# 🚀 How to Run (Docker)

## 1. Clone the repository

```bash id="c1"
git clone https://github.com/your-username/WindStore.git
cd WindStore
```

---

## 2. Start the project

```bash id="c2"
docker compose up --build
```

---

## 3. Open in browser

Frontend:

```text id="f1"
http://localhost:5173
```

Backend API:

```text id="b1"
http://localhost:5000
```

---

## 4. Stop the project

```bash id="c3"
docker compose down
```

---

# 🐳 Docker Setup

## 📄 docker-compose.yml

```yaml id="dc1"
version: "3.8"

services:
  server:
    build: ./server
    ports:
      - "5000:5000"
    volumes:
      - ./server:/app
      - /app/node_modules

  client:
    build: ./client
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server
```

---

## 📄 server/Dockerfile

```dockerfile id="d1"
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

---

## 📄 client/Dockerfile

```dockerfile id="d2"
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
```

---

## 📄 .dockerignore (both client & server)

```text id="d3"
node_modules
dist
build
.env
```

---

# 🔗 API Connection

Frontend communicates with backend via:

```text id="api1"
http://server:5000/api
```

❗ NOT `localhost` when using Docker.

---

# 🧠 Tech Stack

## Frontend

- React
- TypeScript
- Vite

## Backend

- Node.js
- Express

## DevOps

- Docker
- Docker Compose

---

# 👨‍💻 Development Workflow

### Start everything:

```bash id="wf1"
docker compose up --build
```

### Rebuild after changes:

```bash id="wf2"
docker compose up --build
```

### Stop containers:

```bash id="wf3"
docker compose down
```

---

# ⚡ Benefits of Docker Setup

- No manual Node.js installation required
- Same environment for all contributors
- Works on Windows / Mac / Linux
- Easy onboarding (1 command setup)
- Production-ready foundation

---

# 🤝 Contributing

1. Fork repo
2. Create feature branch:

```bash id="cb1"
git checkout -b feature/your-feature
```

3. Commit changes:

```bash id="cb2"
git commit -m "Add feature"
```

4. Push branch:

```bash id="cb3"
git push origin feature/your-feature
```

5. Open Pull Request

---

# 📌 Notes

- Make sure Docker is running before starting project
- Backend runs on port `5000`
- Frontend runs on port `5173`
