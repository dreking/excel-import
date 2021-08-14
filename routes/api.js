const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const uploadRoutes = require('./upload');

router.use('/auth', authRoutes);

router.use('/uploads', uploadRoutes);

module.exports = router;
