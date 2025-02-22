import { Plugin } from '@nuxt/types';
import axios from 'axios';

const translatePlugin: Plugin = (context, inject) => {
  inject('translate', async (text: string, targetLang: string) => {
    if (!text || !targetLang) {
      console.error('🚨 翻訳エラー: text または targetLang が未定義', { text, targetLang });
      return '翻訳に失敗しました（無効な入力）';
    }

    try {
      console.log("📤 翻訳リクエスト送信:", { text, targetLang }); // 🔥 ログ追加
      const response = await axios.post('/api/translate', { text, targetLang });
      console.log("✅ 翻訳レスポンス:", response.data);
      return response.data.translatedText;
    } catch (err: any) {
      console.error('❌ 翻訳エラー:', err.response?.data || err);
      return '翻訳に失敗しました';
    }
  });
};

export default translatePlugin;