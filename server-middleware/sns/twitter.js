// server-middleware/sns/twitter.js

require('dotenv').config();
const express = require('express');
const Twitter = require('twitter-lite');

const app = express();
app.use(express.json()); // JSON のパース

// Twitter投稿の関数
async function postToSNS(text, mediaUrl) {
  console.log("📢 Twitter 投稿:", { text, mediaUrl });

  try {
    // ダミーの認証情報（後で本物のキーを設定）
    const client = new Twitter({
      subdomain: "api",
      consumer_key: process.env.TWITTER_API_KEY || "dummy_consumer_key",
      consumer_secret: process.env.TWITTER_API_SECRET_KEY || "dummy_consumer_secret",
      access_token_key: process.env.TWITTER_ACCESS_TOKEN || "dummy_access_token",
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "dummy_access_token_secret",
    });

    // 本来は Twitter の statuses/update エンドポイントを呼び出してツイートを投稿
    // ここではキーがダミーなので、実際の投稿は行わず、仮のレスポンスを返します。
    // const response = await client.post("statuses/update", { status: text })
    // return response;

    // 仮の成功レスポンス
    return { message: "Dummy tweet posted successfully", text, mediaUrl };
  } catch (error) {
    console.error('Twitter posting error:', error);
    throw new Error("Twitter の投稿に失敗しました");
  }
}

// 既存のエンドポイント（変更なし）
app.post('/api/post-to-twitter', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await postToSNS(text, null);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { app, postToSNS };