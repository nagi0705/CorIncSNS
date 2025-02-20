// server-middleware/sns.js

require('dotenv').config();
const express = require('express');
const Twitter = require('twitter-lite');

const app = express();
app.use(express.json());

const dummyResponse = { message: "ダミー投稿成功" };

// Twitter API
app.post('/api/post-to-twitter', async (req, res) => {
  console.log('Twitter投稿:', req.body);
  res.json(dummyResponse);
});

// Mixi2 API（ダミー）
app.post('/api/post-to-mixi', async (req, res) => {
  console.log('Mixi2投稿:', req.body);
  res.json(dummyResponse);
});

// LinkedIn API（ダミー）
app.post('/api/post-to-linkedin', async (req, res) => {
  console.log('LinkedIn投稿:', req.body);
  res.json(dummyResponse);
});

// Facebook API（ダミー）
app.post('/api/post-to-facebook', async (req, res) => {
  console.log('Facebook投稿:', req.body);
  res.json(dummyResponse);
});

module.exports = app;