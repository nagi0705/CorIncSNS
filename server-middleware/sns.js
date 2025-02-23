require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const dummyResponse = { message: "ダミー投稿成功" };

const postToSNS = (platform) => {
  return async (req, res) => {
    const { text, translation, mediaUrl } = req.body;

    console.log(`📢 ${platform} 投稿リクエスト受信:`);
    console.log("🔹 原文:", text || "(なし)");
    console.log("🔹 翻訳:", translation || "(なし)");
    console.log("🔹 メディアURL:", mediaUrl || "(なし)");

    res.json({
      message: `${platform} 投稿成功 ✅`,
      postedData: { text, translation, mediaUrl }
    });
  };
};

// 各SNSのダミー投稿エンドポイント
app.post('/api/post-to-twitter', postToSNS("Twitter"));
app.post('/api/post-to-facebook', postToSNS("Facebook"));
app.post('/api/post-to-instagram', postToSNS("Instagram"));
app.post('/api/post-to-linkedin', (req, res) => {
  const { text, translation, mediaUrl } = req.body;

  console.log("📢 LinkedIn 投稿リクエスト:", { text, translation, mediaUrl });

  res.json({
    message: "Dummy LinkedIn post successful",
    postedData: { text, translation, mediaUrl }
  });
});

module.exports = app;