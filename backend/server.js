const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');

const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/basagas';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || 'http://localhost:4200').split(',');
const SOCKET_TOKEN_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    credentials: true,
  },
});

const csrfProtection = csrf({ cookie: true });

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGINS,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(csrfProtection);

app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

function generateToken(user) {
  return jwt.sign({
    id: user._id.toString(),
    role: user.role,
    username: user.username,
  }, JWT_SECRET, { expiresIn: '12h' });
}

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      role,
      password,
      cylinderManufacturer,
      usualPickupAddress,
      usualDropoffAddress,
      startingPoint,
    } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['customer', 'deliverer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role supplied' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      phone,
      role,
      password: hashed,
      cylinder_manufacturer: cylinderManufacturer,
      usual_pickup_address: usualPickupAddress,
      usual_dropoff_address: usualDropoffAddress,
      starting_point: startingPoint,
      is_active_broadcast: false,
    });

    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
});

app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, cylinderSize, manufacturer } = req.body;

    if (!pickupAddress || !dropoffAddress || !cylinderSize || !manufacturer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const order = await Order.create({
      customer_id: req.user.id,
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
      cylinder_size: cylinderSize,
      manufacturer,
      status: 'Pending',
    });

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create order' });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  const orders = await Order.find({ customer_id: req.user.id }).sort({ created_at: -1 });
  res.json({ orders });
});

app.post('/api/payments/yoco-token', authenticate, (req, res) => {
  const { token, amount } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  console.log(`Received Yoco token ${token} for amount ${amount}`);
  res.json({ status: 'stored', token });
});

const liveLocations = new Map();

function purgeInactiveLocations() {
  const cutoff = Date.now() - SOCKET_TOKEN_EXPIRY_MS;
  for (const [userId, data] of liveLocations.entries()) {
    if (data.updated < cutoff) {
      liveLocations.delete(userId);
    }
  }
}

setInterval(purgeInactiveLocations, 30 * 1000);

app.get('/api/live-locations', (_req, res) => {
  purgeInactiveLocations();
  res.json({
    deliverers: Array.from(liveLocations.values()).map((item) => ({
      user_id: item.user_id,
      username: item.username,
      lat: item.lat,
      lng: item.lng,
      updated: item.updated,
    })),
  });
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication token missing'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const user = socket.user;
  if (!user) {
    socket.disconnect(true);
    return;
  }

  socket.emit('active-deliverers', Array.from(liveLocations.values()));

  socket.on('share-location', ({ lat, lng }) => {
    if (user.role !== 'deliverer') {
      return;
    }

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return;
    }

    const updated = Date.now();
    const locationEntry = {
      user_id: user.id,
      username: user.username,
      lat,
      lng,
      updated,
    };

    liveLocations.set(user.id, locationEntry);
    io.emit('deliverer-location-update', locationEntry);
  });

  socket.on('disconnect', () => {
    if (user.role === 'deliverer') {
      const current = liveLocations.get(user.id);
      if (current && Date.now() - current.updated > SOCKET_TOKEN_EXPIRY_MS) {
        liveLocations.delete(user.id);
        io.emit('deliverer-offline', { user_id: user.id });
      }
    }
  });
});

const angularDistCandidates = [
  path.join(__dirname, '..', 'frontend', 'dist', 'basagas-frontend', 'browser'),
  path.join(__dirname, '..', 'frontend', 'dist', 'basagas-frontend'),
];

const distPath = angularDistCandidates.find((candidate) => fs.existsSync(candidate));

if (distPath) {
  console.log(`Serving Angular build from ${distPath}`);
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('Angular build not found. API will run without serving frontend assets.');
  const fallbackMessage = [
    'BasaGas API is running.',
    'To view the Angular frontend from this server, run "npm run build" inside the frontend/ directory.',
    'The compiled assets must exist at frontend/dist/basagas-frontend/browser before restarting the API.',
    'Alternatively, start the Angular dev server with "npm start" inside frontend/ and browse http://localhost:4200/.',
  ].join('\n');

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.type('text/plain').status(200).send(fallbackMessage);
  });
}


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
