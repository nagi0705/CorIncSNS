require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// ダミーのLinkedIn投稿API
app.post('/api/post-to-linkedin', async (req, res) => {
  const { text, mediaUrl } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'テキストが必要です' });
  }

  try {
    console.log("📢 LinkedIn 投稿リクエスト受信:", { text, mediaUrl });

    // 🔹 ダミーの成功レスポンス
    return res.json({
      message: "Dummy LinkedIn post successful",
      postedData: { text, mediaUrl }
    });

  } catch (error) {
    console.error('LinkedIn posting error:', error);
    return res.status(500).json({ error: 'LinkedIn 投稿に失敗しました' });
  }
});

module.exports = app;