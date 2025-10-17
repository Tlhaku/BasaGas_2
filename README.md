# BasaGas Codex Platform

This repository contains the BasaGas Codex MVP – a MEAN stack implementation for small-cylinder LPG refill ordering,
deliverer live tracking, and Yoco payment tokenisation.

## Project structure

- `backend/` – Express + MongoDB API with JWT authentication, CSRF protection, WebSocket live tracking, and Yoco token
  placeholder endpoints.
- `frontend/` – Angular application that powers the marketing pages, order flow, customer/deliverer accounts, real-time
  map tracking, and deliverer broadcasting screens.

## Prerequisites

Install the following tools on your local machine before running the stack:

- **Node.js 18+** and **npm** – runtime and package manager for both backend and frontend.
- **MongoDB 6+** – local or cloud instance accessible via connection string (defaults to `mongodb://127.0.0.1:27017/basagas`).
- **Google Maps JavaScript API key** with Places library enabled.
- **Yoco Checkout public key** for tokenisation demos.

## Backend setup

1. Copy the environment template and populate secrets:
   ```bash
   cd backend
   cp ../.env.example ../.env
   # edit ../.env to set MONGODB_URI, JWT_SECRET, CLIENT_ORIGINS, YOCO keys, etc.
   ```
2. Install dependencies and start the API:
   ```bash
   npm install
   npm run dev   # or npm start for production mode
   ```

The backend starts on `http://localhost:5000` by default and exposes REST endpoints under `/api`, WebSocket events for
live tracking, and serves the production Angular bundle from `frontend/dist/basagas-frontend/browser` (Angular 18
default) when built.

## Frontend setup

1. In a new terminal, install Angular dependencies:
   ```bash
   cd frontend
   npm install
   cp src/assets/env.template.js src/assets/env.js  # adjust URLs and keys
   ```
2. Update `src/assets/env.js` with your API base URL, socket URL, Google Maps key, and Yoco public key.
3. Build the production bundle that Express can host:
   ```bash
   npm run build
   ```
   The compiled files will be generated in `dist/basagas-frontend/browser/`.
4. (Optional for rapid iteration) run the Angular development server instead of building:
   ```bash
   npm start
   ```
   The Angular app runs on `http://localhost:4200` and proxies API calls to the backend configured in `env.js`.

## Running the full platform

1. Start MongoDB locally or update `.env` with your Atlas connection string.
2. Run the backend (`npm run dev` inside `backend/`).
3. Run the Angular frontend (`npm start` inside `frontend/`).
4. Register a user via the frontend, place an order, and share deliverer location to exercise the workflow.

## Testing

Placeholder npm test scripts exist for both workspaces. There are currently no automated tests beyond dependency checks.
