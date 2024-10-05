// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./Routes/authRoutes');
const problemRoutes = require('./Routes/problemRoutes');
const commentRoutes = require('./Routes/commentRoutes'); // Ensure this is included

app.use(cors());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use('/api', authRoutes);
app.use('/api', problemRoutes);
app.use('/api', commentRoutes); // Ensure this is included

module.exports = app;
