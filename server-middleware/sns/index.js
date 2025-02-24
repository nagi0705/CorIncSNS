require('dotenv').config();
const express = require('express');

const twitter = require('./twitter');
const facebook = require('./facebook');
const instagram = require('./instagram');
const linkedin = require('./linkedin');

const app = express();
app.use(express.json());

/**
 * SNS投稿を統括するエンドポイント
 * リクエスト例:
 * POST /api/sns/post
 * { "platform": "twitter", "text": "投稿テキスト", "mediaUrl": "画像URL" }
 */

// ✅ SNS投稿の関数を統一
const snsServices = {
  twitter: twitter.postToSNS,
  facebook: facebook.postToSNS,
  instagram: instagram.postToSNS,
  linkedin: linkedin.postToSNS
};

app.post('/post', async (req, res) => {
  const { platform, text, mediaUrl } = req.body;

  if (!platform || !text) {
    return res.status(400).json({ error: 'プラットフォームとテキストは必須です' });
  }

  const snsService = snsServices[platform];

  if (!snsService) {
    return res.status(400).json({ error: '対応していないプラットフォームです' });
  }

  try {
    const response = await snsService(text, mediaUrl);
    res.json({ message: `${platform} に投稿成功`, response });
  } catch (error) {
    console.error(`${platform} 投稿エラー:`, error);
    res.status(500).json({ error: `${platform} の投稿に失敗しました` });
  }
});

module.exports = app;