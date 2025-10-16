# BasaGas

This repository contains a lightweight BasaGas prototype with a Node/Express backend and a modern React front end that consumes Google Maps services for location-aware ordering and live delivery tracking.

## Prerequisites

Install the following tools before running either project:

- [Node.js 18+](https://nodejs.org/) (which includes `npm`).
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally at `mongodb://localhost:27017/basagas` for the API.
- A Google Maps Platform API key with the **Maps JavaScript**, **Places**, **Routes**, and **Roads** APIs enabled. The demo front end falls back to `AIzaSyCYxFkL9vcvbaFz-Ut1Lm2Vge5byodujfk` if no environment variable is supplied.

## Backend (Express API)

```bash
cd backend
cp .env.example .env   # configure MongoDB connection or credentials if needed
npm install
npm start
```

The backend listens on `http://localhost:5000` and provides the order endpoints consumed by the React client.

### Backend dependencies

- `express`
- `mongodb`
- Any other libraries listed in `backend/package.json` (installed automatically via `npm install`).

## Frontend (React + Vite)

```bash
cd frontend
npm install
echo "VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE" > .env  # optional: omit to use the bundled demo key
npm run dev
```

The development server runs on `http://localhost:5173`. The React interface includes:

- A Google Places-powered order form with live pricing and "Use my location" shortcuts.
- Registration and login flows for customers and delivery drivers.
- A tracking dashboard backed by the Maps, Routes, and Roads APIs that can follow a device's live geolocation updates.

### Frontend dependencies

Installed via `npm install` in the `frontend` directory:

- `react` and `react-dom`
- `react-router-dom`
- `@googlemaps/js-api-loader`
- Vite, ESLint, Tailwind CSS, and related tooling (see `frontend/package.json`).

## Testing

The backend currently exposes placeholder tests:

```bash
cd backend
npm test
```

The frontend does not yet include automated tests; use `npm run lint` or manual browser testing to verify changes.
