require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  console.log("🔍 受信したリクエスト:", req.body); // 🔥 ログを追加

  if (!text || !targetLang) {
    console.error("🚨 翻訳エラー: テキストまたはターゲット言語が未定義");
    return res.status(400).json({ error: 'テキストとターゲット言語が必要です' });
  }

  try {
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