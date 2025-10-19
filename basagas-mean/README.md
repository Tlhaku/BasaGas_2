# BasaGas MEAN Starter

This repository contains a minimal MEAN (MongoDB, Express, Angular, Node.js) project that demonstrates the core interactions for the BasaGas LPG refill platform. The template exposes an Express API with health and ping endpoints, a Mongo-backed `pings` collection, and an Angular 17 single-page UI that can trigger both endpoints.

## Project Structure

```
basagas-mean/
├── package.json
├── README.md
├── server/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── models/
│   │   └── ping.model.js
│   └── routes/
│       └── health.route.js
└── client/
    ├── angular.json
    ├── package.json
    └── src/
        ├── index.html
        ├── main.ts
        ├── styles.css
        └── app/
            ├── app.component.css
            ├── app.component.html
            ├── app.component.ts
            └── app.routes.ts
```

## Prerequisites

Install the following software:

- [Node.js 18+](https://nodejs.org/) and npm (ships with Node.js)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a MongoDB Atlas connection string

## Environment Variables

The API reads its configuration from `server/.env`. The template already includes default values:

```
MONGODB_URI=mongodb://127.0.0.1:27017/basagas
PORT=4000
```

Update the URI if you are using a remote MongoDB deployment.

## Installation

Install dependencies for both the API and the Angular client:

```bash
cd basagas-mean
npm run install:all
```

Alternatively install each project individually:

```bash
cd basagas-mean/server
npm install

cd ../client
npm install
```

> **Troubleshooting:** If you see `Error: Cannot find module 'express'` (or a similar message for other packages) when running the
> API, it means the server dependencies were not installed. Run `npm install` inside `basagas-mean/server` before starting the
> server again.

## Running the API

Start MongoDB locally or ensure your Atlas cluster is running, then launch the Express server:

```bash
cd basagas-mean/server
npm start
```

The API listens on the port specified in `server/.env` (default `http://localhost:4000`). The available endpoints are:

- `GET /api/health` — returns `{ "status": "ok" }`.
- `POST /api/ping` — inserts a document into the `pings` collection and returns the MongoDB `_id`.

## Running the Angular Client

In a separate terminal, start the Angular development server:

```bash
cd basagas-mean/client
npm start
```

Angular CLI opens the app in your browser (default `http://localhost:4200`). Use the **Check API** button to call `/api/health` and **Ping DB** to store a new ping document. Responses display in the cards below the buttons.

## Testing the Integration

1. Start MongoDB and the Express API.
2. Start the Angular dev server.
3. In the browser, open the Angular app and click **Check API**. You should see `{"status":"ok"}`.
4. Click **Ping DB**. You should see the inserted document ID. Verify the document in MongoDB with:
   ```bash
   mongo
   use basagas
   db.pings.find().sort({ createdAt: -1 }).limit(5).pretty()
   ```

## Responsive Design Notes

The Angular component uses fluid widths, `clamp()`-based typography, and flex/grid layouts to ensure the UI works on both desktop and small mobile screens without additional configuration.

## License

Released under the MIT License. See [LICENSE](../LICENSE) for details.
