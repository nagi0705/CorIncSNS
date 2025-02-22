// server-middleware/sns.js

require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const dummyResponse = { message: "ダミー投稿成功" };

/**
 * 汎用SNS投稿処理
 * @param {string} platform SNSの種類（Twitter, LinkedIn, Mixi, Facebook）
 */
const postToSNS = (platform) => {
  return async (req, res) => {
    const { text, translation, mediaUrl } = req.body;

    console.log(`📢 ${platform} 投稿リクエスト受信:`);
    console.log("🔹 原文:", text || "(なし)");
    console.log("🔹 翻訳:", translation || "(なし)");
    console.log("🔹 メディアURL:", mediaUrl || "(なし)");

    // ダミーレスポンスを返す
    res.json({
      message: `${platform} 投稿成功 ✅`,
      postedData: { text, translation, mediaUrl }
    });
  };
};

// 各SNSのエンドポイント
app.post('/api/post-to-twitter', postToSNS("Twitter"));
app.post('/api/post-to-mixi', postToSNS("Mixi"));
app.post('/api/post-to-linkedin', postToSNS("LinkedIn"));
app.post('/api/post-to-facebook', postToSNS("Facebook"));

module.exports = app;