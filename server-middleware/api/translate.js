require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

/**
 * 📌 翻訳APIエンドポイント
 * POST /api/translate
 * { "text": "こんにちは", "targetLang": "en" }
 */
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  console.log("🔍 受信した翻訳リクエスト:", { text, targetLang });

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'テキストとターゲット言語が必要です' });
  }

  try {
    // Google Translate APIを使用
    const response = await axios.post('https://translate.googleapis.com/translate_a/single', null, {
      params: {
        client: 'gtx',
        sl: 'auto',
        tl: targetLang,
        dt: 't',
        q: text
      }
    });

    console.log("✅ 翻訳成功:", response.data);
    res.json({ translatedText: response.data[0][0][0] });
  } catch (error) {
    console.error("❌ 翻訳APIエラー:", error.response?.data || error);
    res.status(500).json({ error: '翻訳に失敗しました' });
  }
});

module.exports = app;