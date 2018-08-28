const express = require('express');

const router = express.Router();
const apiPosts = require('./api/posts');
const home = require('./home');
const about = require('./about');

// API routes
router.get('/api/v1/posts/:year?/:month?/:day?', apiPosts.getPosts);

// Pages routes
router.get('/', home);
router.get('/about', about);

module.exports = router;
