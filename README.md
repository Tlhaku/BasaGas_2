# BasaGas

This project contains a minimal implementation of the BasaGas LPG ordering platform with a React frontend and Node.js/Express backend. All assets and scripts are local so the app can run offline once dependencies are installed.

## Prerequisites
- Node.js 18+
- npm
- MongoDB running locally at `mongodb://localhost:27017/basagas`

## Backend Setup
```bash
cd backend
cp .env.example .env  # adjust if needed
npm install
npm start
```
The backend exposes `POST /api/orders` for creating orders.

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend runs at http://localhost:5173 and communicates with the backend at http://localhost:5000.

## Testing
Both frontend and backend currently have placeholder tests:
```bash
npm test  # run inside backend or frontend
```
