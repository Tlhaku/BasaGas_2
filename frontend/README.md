# BasaGas Codex Front-end

This project contains the Angular application for the BasaGas Codex platform. It implements the public marketing pages,
customer and deliverer flows, order capture, live tracking, and Yoco payment tokenisation demo outlined in the SRS.

## Available scripts

- `npm start` – run the development server on `http://localhost:4200`.
- `npm run build` – build the production bundle to `dist/basagas-frontend`.
- `npm test` – execute Karma unit tests (none provided yet).

## Environment configuration

Copy `src/assets/env.template.js` to `src/assets/env.js` and provide the correct values for:

- `API_BASE_URL` – typically `http://localhost:5000/api`.
- `SOCKET_URL` – typically `http://localhost:5000`.
- `GOOGLE_MAPS_API_KEY` – Google Maps JavaScript API key with Places access.
- `YOCO_PUBLIC_KEY` – Yoco Checkout public key.
- `PRODUCTION` – set to `true` when serving from production.
