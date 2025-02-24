// server-middleware/sns/facebook.js

require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json()); // JSON のパース

// Facebook投稿の関数
async function postToSNS(text, mediaUrl) {
  console.log("📢 Facebook 投稿:", { text, mediaUrl });

  if (!text) {
    throw new Error("Facebook の投稿にはテキストが必要です。");
  }

  try {
    // 🔹 仮の成功レスポンス
    return {
      message: "Dummy Facebook post successful",
      postedData: { text, mediaUrl }
    };
  } catch (error) {
    console.error('Facebook posting error:', error);
    throw new Error("Facebook の投稿に失敗しました");
  }
}

// 既存のエンドポイント（変更なし）
app.post('/api/post-to-facebook', async (req, res) => {
  const { text, mediaUrl } = req.body;

  try {
    const response = await postToSNS(text, mediaUrl);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { app, postToSNS };