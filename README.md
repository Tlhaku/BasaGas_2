# BasaGas

This project contains a minimal implementation of the BasaGas LPG ordering platform using the MEAN stack. A Node.js/Express backend serves static AngularJS-powered HTML pages styled with a blue and orange theme inspired by [Communica](https://www.communica.co.za/). All client-side dependencies (AngularJS and styles) are included in the repo so the app can run fully offline once Node and MongoDB are installed.


## Prerequisites
- Node.js 18+
- npm
- MongoDB running locally at `mongodb://localhost:27017/basagas`

## Setup & Run

```bash
cd backend
cp .env.example .env  # adjust if needed
npm install
npm start
```
The server listens on `http://localhost:5000` and serves:
- `/` – Home page
- `/order.html` – Order form with Google Maps pickup/delivery selection that posts to `POST /api/orders`
- `/pricing.html` – Pricing table
- `/login.html` – Customer login
- `/tracking.html` – Cylinder and driver tracking map
 
### Required packages
- **Node.js 18+** and **npm** – runtime and package manager for the server.
- **MongoDB** – running locally on `mongodb://localhost:27017/basagas`.
No additional packages are required for the front-end because AngularJS (v1.8.3) is bundled under `backend/public/libs`. To enable the Google Maps features, supply a valid API key by replacing `YOUR_API_KEY` in `order.html` and `tracking.html`.

## Testing
The backend currently includes placeholder tests:
```bash
cd backend
npm test

```
