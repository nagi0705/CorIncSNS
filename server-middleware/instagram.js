require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json()); // JSON のパース

// POST リクエストで Instagram に投稿するエンドポイント
app.post('/api/post-to-instagram', async (req, res) => {
  const { text, mediaUrl } = req.body;

  if (!mediaUrl) {
    return res.status(400).json({ error: "Instagram の投稿には画像または動画が必須です。" });
  }

  try {
    // ダミーの認証情報（後で本物のキーを設定）
    const client = new Twitter({
      subdomain: "api",
      consumer_key: process.env.INSTAGRAM_API_KEY || "dummy_consumer_key",
      consumer_secret: process.env.INSTAGRAM_API_SECRET_KEY || "dummy_consumer_secret",
      access_token_key: process.env.INSTAGRAM_ACCESS_TOKEN || "dummy_access_token",
      access_token_secret: process.env.INSTAGRAM_ACCESS_TOKEN_SECRET || "dummy_access_token_secret",
    })

    // 本来は Instagram の API を呼び出して投稿
    // ここではキーがダミーなので、実際の投稿は行わず、仮のレスポンスを返します。
    // const response = await client.post("statuses/update", { status: text })
    // return res.json(response)

    // 仮の成功レスポンス
    return res.json({ message: "Dummy instagram posted successfully", text: text })
  } catch (error) {
    console.error('Instagram posting error:', error)
    return res.status(500).json({ error: error.message })
  }
});

module.exports = app;