import { Plugin } from '@nuxt/types'
import axios from 'axios'

const translatePlugin: Plugin = (context, inject) => {
  inject('translate', async (text: string, targetLang: string) => {
    try {
      const response = await axios.post('/api/translate', { text, targetLang })
      return response.data.translatedText
    } catch (err) {
      console.error('Translation Error:', err)
      return '翻訳に失敗しました'
    }
  })
}

export default translatePlugin