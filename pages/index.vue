<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cor.Inc SNS</h1>

    <!-- テキスト入力 -->
    <div class="mb-4">
      <label for="inputText" class="block text-lg">テキスト入力（最大140文字）</label>
      <textarea id="inputText" v-model="postText" class="w-full border p-2" placeholder="ここにテキストを入力してください"></textarea>
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
        <!-- Twitter 投稿ボタン -->
        <div class="flex space-x-2">
          <button @click="postToSNS('twitter', 'original')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Twitter（テキスト）
          </button>
          <button @click="postToSNS('twitter', 'translated')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Twitter（翻訳）
          </button>
          <button @click="postToSNS('twitter', 'both')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Twitter（両方）
          </button>
          <button @click="postToSNS('twitter', 'media')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="!uploadedFileUrl">
            Twitter（画像/動画）
          </button>
        </div>

        <!-- Facebook 投稿ボタン -->
        <div class="flex space-x-2">
          <button @click="postToSNS('facebook', 'original')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Facebook（テキスト）
          </button>
          <button @click="postToSNS('facebook', 'translated')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Facebook（翻訳）
          </button>
          <button @click="postToSNS('facebook', 'both')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Facebook（両方）
          </button>
          <button @click="postToSNS('facebook', 'media')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="!uploadedFileUrl">
            Facebook（画像/動画）
          </button>
        </div>

        <!-- Instagram 投稿ボタン -->
        <div class="flex space-x-2">
          <button @click="postToSNS('instagram', 'original')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Instagram（テキスト）
          </button>
          <button @click="postToSNS('instagram', 'translated')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Instagram（翻訳）
          </button>
          <button @click="postToSNS('instagram', 'both')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Instagram（両方）
          </button>
          <button @click="postToSNS('instagram', 'media')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="!uploadedFileUrl">
            Instagram（画像/動画）
          </button>
        </div>
      </div>
    </div>

    <!-- 通知表示 -->
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
      debouncedTranslate: null as unknown as (text: string) => void, // 🔥 翻訳用のデバウンス関数
    };
  },
  computed: {
    isTextTooLong() {
      return this.postText.length > 140;
    },
  },
  watch: {
    postText: {
      handler(newText) {
        if (this.debouncedTranslate) {
          this.debouncedTranslate(newText); // 🔥 テキスト変更時に翻訳を実行
        }
      },
      immediate: true,
    },
  },
  methods: {
    async postToSNS(platform: string, type: string) {
      if (this.isTextTooLong) {
        this.notification = { message: '140文字以内で入力してください。', type: 'error' };
        return;
      }

      let textToPost = this.postText;
      if (type === 'translated') {
        textToPost = this.translationResult;
      } else if (type === 'both') {
        textToPost = `原文: ${this.postText}\n翻訳: ${this.translationResult}`;
      } else if (type === 'media') {
        if (!this.uploadedFileUrl) {
          this.notification = { message: '画像または動画をアップロードしてください。', type: 'error' };
          return;
        }
        textToPost = `📷 ${this.uploadedFileUrl}`;
      }

      try {
        const response = await this.$axios.$post(`/api/post-to-${platform}`, { text: textToPost });
        this.notification = { message: `${platform.toUpperCase()} 投稿成功: ${response.message}`, type: 'success' };
      } catch (error) {
        console.error(error);
        this.notification = { message: `${platform.toUpperCase()} 投稿失敗`, type: 'error' };
      }
    },

    addFileUrlToPost(url: string) {
      this.uploadedFileUrl = url;
    },

    async translateText(text: string) {
      try {
        const response = await this.$axios.$post('/api/translate', {
          text,
          targetLang: 'en' // 翻訳先言語を指定
        });
        this.translationResult = response.translatedText;
      } catch (error) {
        console.error('翻訳エラー:', error);
        this.notification = { message: '翻訳に失敗しました', type: 'error' };
      }
    },
  },
  created() {
    this.debouncedTranslate = debounce(this.translateText, 500); // 🔥 翻訳処理をデバウンス化
  },
});
</script>