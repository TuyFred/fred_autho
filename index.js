const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Import CORS
const productRoutes = require('./products');
const authRoutes = require('./auth');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// ✅ Enable CORS for all origins (you can restrict this later)
app.use(cors());

// Secret key for JWT
const SECRET_KEY = 'abefghijklmnopqrstuvwxyz1_234567890jdfyhgtuasjgfdsbfeadbmfjdfbvchjdbv_edhs';

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer TOKEN'

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user; // Save user info
    next();
  });
}

// Root route
app.get('/', (req, res) => {
  res.send('Fred API IS WORKING PROPERLY');
});

// Route handlers
app.use('/auth', authRoutes);
app.use('/products', authenticateToken, productRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
