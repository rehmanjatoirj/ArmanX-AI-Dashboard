# ArmanX Backend

Production-oriented Node.js + Express + MongoDB backend for the ArmanX AI LinkedIn agent dashboard.

## Stack

- Node.js 20+
- Express + TypeScript
- MongoDB + Mongoose
- Redis + BullMQ
- JWT auth + bcrypt
- Socket.io for live logs
- Zod validation
- Jest + Supertest + mongodb-memory-server

## Scripts

```bash
npm install
npm run dev
npm run build
npm test
```

## Environment

Copy `.env.example` to `.env` and provide:

```env
MONGODB_URI=mongodb://localhost:27017/armanx_ai
REDIS_URL=redis://localhost:6379
JWT_SECRET=minimum-32-character-secret-change-this
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CLIENT_URL=http://localhost:5173
```

## Local Run

### Without Docker

1. Start MongoDB on `localhost:27017`
2. Start Redis on `localhost:6379`
3. Run:

```bash
npm run dev
```

In a separate terminal, start the worker:

```bash
npx ts-node src/jobs/agent.worker.ts
```

### With Docker

```bash
docker-compose up --build
```

## API Base

All routes are namespaced under:

```text
/api/v1
```

Key endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /agents`
- `POST /agents/:id/start`
- `GET /leads/export/csv`
- `GET /metrics/dashboard`
- `GET /metrics/funnel`
- `GET /logs`

## Deployment Notes

This backend requires:

- persistent Node process for Socket.io
- Redis for BullMQ
- background worker process

That makes it a better fit for Railway, Render, Fly.io, ECS, or a VPS than a pure serverless platform.
