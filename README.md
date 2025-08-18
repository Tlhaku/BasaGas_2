# BasaGas

This project contains a minimal implementation of the BasaGas LPG ordering platform using the MEAN stack. A Node.js/Express backend serves static AngularJS-powered HTML pages so the app can run fully offline once dependencies are installed.

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
- `/order.html` – Order form that posts to `POST /api/orders`
- `/pricing.html` – Pricing table

## Testing
The backend currently includes placeholder tests:
```bash
cd backend
npm test
```
