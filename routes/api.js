const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const uploadRoutes = require('./upload');

router.use('/auth', authRoutes);

router.use('/upload', uploadRoutes);

module.exports = router;
