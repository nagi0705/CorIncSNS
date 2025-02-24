// server-middleware/sns/linkedin.js

require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json()); // JSON のパース

// LinkedIn投稿の関数
async function postToSNS(text, mediaUrl) {
  console.log("📢 LinkedIn 投稿リクエスト受信:", { text, mediaUrl });

  try {
    // 🔹 ダミーの成功レスポンス
    return {
      message: "Dummy LinkedIn post successful",
      postedData: { text, mediaUrl }
    };
  } catch (error) {
    console.error('LinkedIn posting error:', error);
    throw new Error("LinkedIn の投稿に失敗しました");
  }
}

// 既存のエンドポイント（変更なし）
app.post('/api/post-to-linkedin', async (req, res) => {
  const { text, mediaUrl } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'テキストが必要です' });
  }

  try {
    const response = await postToSNS(text, mediaUrl);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { app, postToSNS };