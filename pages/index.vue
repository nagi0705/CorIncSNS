<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cor.Inc SNS</h1>

    <!-- 🔹 SNS認証ボタン -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">SNSログイン</h2>
      <div class="flex space-x-2">
        <button @click="login('twitter')" class="bg-blue-400 text-white px-4 py-2 rounded">
          Twitter ログイン
        </button>
        <button @click="login('facebook')" class="bg-yellow-400 text-white px-4 py-2 rounded">
          Facebook ログイン
        </button>
        <button @click="login('instagram')" class="bg-pink-400 text-white px-4 py-2 rounded">
          Instagram ログイン
        </button>
        <button @click="login('linkedin')" class="bg-green-400 text-white px-4 py-2 rounded">
          LinkedIn ログイン
        </button>
      </div>
      <p v-if="user.name" class="text-green-600 mt-2">ログイン中: {{ user.name }}</p>
    </div>

    <!-- テキスト入力 -->
    <div class="mb-4">
      <label for="inputText" class="block text-lg">テキスト入力（最大140文字）</label>
      <textarea id="inputText" v-model="postText" @input="debouncedTranslate" class="w-full border p-2"
        placeholder="ここにテキストを入力してください"></textarea>
      <p class="text-sm text-gray-500">{{ postText.length }}/140 文字</p>
      <p v-if="isTextTooLong" class="text-red-500 text-sm mt-1">⚠️ 140文字以内で入力してください。</p>
    </div>

    <!-- 翻訳結果 -->
    <div class="mb-4">
      <label class="block text-lg">翻訳結果</label>
      <textarea v-model="translationResult" readonly class="w-full border p-2" placeholder="翻訳結果がここに表示されます"></textarea>
    </div>

    <!-- 画像・動画アップロード -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">画像/動画アップロード</h2>
      <FileUploader @upload-success="addFileUrlToPost" />
    </div>

    <!-- SNS 投稿ボタン -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">SNS 投稿</h2>
      <div class="space-y-2">
        <!-- 各SNS投稿ボタン -->
        <div v-for="platform in platforms" :key="platform.name" class="flex space-x-2">
          <button v-for="type in platform.types" :key="type" @click="postToSNS(platform.name, type)"
            :class="platform.buttonClass" class="text-white px-4 py-2 rounded" :disabled="isDisabled(type)">
            {{ platform.label }}（{{ type }}）
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 通知表示 -->
    <Notification v-if="notification.message" :message="notification.message" :type="notification.type" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileUploader from '@/components/FileUploader.vue';
import Notification from '@/components/Notification.vue';
import debounce from 'lodash.debounce';

export default Vue.extend({
  name: 'IndexPage',
  components: { FileUploader, Notification },
  data() {
    return {
      postText: '',
      translationResult: '',
      notification: { message: '', type: 'success' },
      uploadedFileUrl: "",
      debouncedTranslate: null as unknown as () => void,
      user: { name: '' },
      platforms: [
        { name: 'twitter', label: 'Twitter', buttonClass: 'bg-blue-400', types: ['テキスト', '翻訳', '両方', '画像/動画'] },
        { name: 'facebook', label: 'Facebook', buttonClass: 'bg-yellow-400', types: ['テキスト', '翻訳', '両方', '画像/動画'] },
        { name: 'instagram', label: 'Instagram', buttonClass: 'bg-pink-400', types: ['テキスト', '翻訳', '両方', '画像/動画'] },
        { name: 'linkedin', label: 'LinkedIn', buttonClass: 'bg-green-400', types: ['テキスト', '翻訳', '両方', '画像/動画'] }
      ]
    };
  },
  computed: {
    isTextTooLong() {
      return this.postText.length > 140;
    }
  },
  methods: {
    async translateText() {
      if (!this.postText.trim()) {
        this.translationResult = '';
        return;
      }
      try {
        const response = await this.$axios.$post('/api/translate', { text: this.postText, targetLang: 'en' });
        this.translationResult = response.translatedText;
      } catch (error) {
        console.error('翻訳エラー:', error);
        this.notification = { message: '翻訳に失敗しました', type: 'error' };
      }
    },
    async postToSNS(platform: string, type: string) {
      if (this.isTextTooLong) {
        this.notification = { message: '140文字以内で入力してください。', type: 'error' };
        return;
      }

      const textToPost = type === '翻訳' ? this.translationResult : this.postText;
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        this.notification = { message: 'ログインが必要です', type: 'error' };
        return;
      }

      try {
        const response = await this.$axios.$post(`/api/post-to-${platform}`, {
          text: textToPost,
          mediaUrl: this.uploadedFileUrl
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        this.notification = { message: `${platform.toUpperCase()} 投稿成功: ${response.message}`, type: 'success' };
      } catch (error) {
        console.error(error);
        this.notification = { message: `${platform.toUpperCase()} 投稿失敗`, type: 'error' };
      }
    },
    async login(platform: string) {
      try {
        const response = await this.$axios.$get(`/api/auth/${platform}`);
        this.user.name = response.user.name;
        sessionStorage.setItem('accessToken', response.accessToken);
        this.notification = { message: `${platform.toUpperCase()} ログイン成功`, type: 'success' };
      } catch (error) {
        console.error(`${platform} ログイン失敗:`, error);
        this.notification = { message: `${platform.toUpperCase()} ログイン失敗`, type: 'error' };
      }
    },
    addFileUrlToPost(url: string) {
      this.uploadedFileUrl = url;
      this.notification = { message: 'ファイルのアップロードが完了しました', type: 'success' };
    },
    isDisabled(type: string) {
      return this.isTextTooLong || (type === '画像/動画' && !this.uploadedFileUrl);
    }
  },
  created() {
    this.debouncedTranslate = debounce(this.translateText, 500);
  }
});
</script>