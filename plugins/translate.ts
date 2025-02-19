// plugins/translate.ts
import { Plugin } from '@nuxt/types'
import { translate } from 'google-translate-api-x'

// Plugin型を使って宣言すると、contextやinjectの型エラーを防げます
const translatePlugin: Plugin = (context, inject) => {
  inject('translate', async (text: string, targetLang: string) => {
    try {
      const result = await translate(text, { to: targetLang })
      return result.text
    } catch (err) {
      console.error('Translation Error:', err)
      return ''
    }
  })
}

export default translatePlugin