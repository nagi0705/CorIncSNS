// server-middleware/twitter.js

// （※後ほど .env で設定するため、ここでは dotenv の読み込みも追加します）
require('dotenv').config()

const express = require('express')
const Twitter = require('twitter-lite')

const app = express()
app.use(express.json())  // JSON のパース

// POST リクエストでツイートを投稿するエンドポイント
app.post('/api/post-to-twitter', async (req, res) => {
  const { text } = req.body
  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }

  try {
    // ダミーの認証情報（後で本物のキーを設定）
    const client = new Twitter({
      subdomain: "api",
      consumer_key: process.env.TWITTER_API_KEY || "dummy_consumer_key",
      consumer_secret: process.env.TWITTER_API_SECRET_KEY || "dummy_consumer_secret",
      access_token_key: process.env.TWITTER_ACCESS_TOKEN || "dummy_access_token",
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "dummy_access_token_secret",
    })

    // 本来は Twitter の statuses/update エンドポイントを呼び出してツイートを投稿
    // ここではキーがダミーなので、実際の投稿は行わず、仮のレスポンスを返します。
    // const response = await client.post("statuses/update", { status: text })
    // return res.json(response)

    // 仮の成功レスポンス
    return res.json({ message: "Dummy tweet posted successfully", text: text })
  } catch (error) {
    console.error('Twitter posting error:', error)
    return res.status(500).json({ error: error.message })
  }
})

module.exports = app