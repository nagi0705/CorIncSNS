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
      <FileUploader />
    </div>

    <!-- SNS 投稿ボタン -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">SNS 投稿</h2>
      <div class="space-y-2">
        <div class="flex space-x-2">
          <button @click="postToSNS('twitter', 'original')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">Twitter（テキスト）</button>
          <button @click="postToSNS('twitter', 'translated')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">Twitter（翻訳）</button>
          <button @click="postToSNS('twitter', 'both')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">Twitter（両方）</button>
        </div>
        <div class="flex space-x-2">
          <button @click="postToSNS('linkedin', 'original')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">LinkedIn（テキスト）</button>
          <button @click="postToSNS('linkedin', 'translated')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">LinkedIn（翻訳）</button>
          <button @click="postToSNS('linkedin', 'both')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">LinkedIn（両方）</button>
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
      debouncedTranslate: null as unknown as (text: string) => void,
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
          this.debouncedTranslate(newText);
        }
      },
      immediate: true,
    },
  },
  methods: {
    async translateText() {
      if (this.isTextTooLong) {
        this.notification = { message: '140文字以内で入力してください。', type: 'error' };
        return;
      }
      try {
        const result = await this.$translate(this.postText, 'en');
        this.translationResult = result;
      } catch (error) {
        console.error('翻訳エラー:', error);
        this.notification = { message: '翻訳失敗', type: 'error' };
      }
    },
    async postToSNS(platform: string, type: string) {
      if (this.isTextTooLong) {
        this.notification = { message: '140文字以内で入力してください。', type: 'error' };
        return;
      }

      let textToPost = '';
      if (type === 'original') {
        textToPost = this.postText;
      } else if (type === 'translated') {
        textToPost = this.translationResult;
      } else if (type === 'both') {
        textToPost = `原文: ${this.postText}\n翻訳: ${this.translationResult}`;
      }

      if (!textToPost) {
        this.notification = { message: '投稿する内容がありません。', type: 'error' };
        return;
      }

      try {
        const response = await this.$axios.$post(`/api/post-to-${platform}`, { text: textToPost });
        this.notification = { message: `${platform.toUpperCase()} 投稿成功: ${response.message}`, type: 'success' };
      } catch (error) {
        console.error(error);
        this.notification = { message: `${platform.toUpperCase()} 投稿失敗`, type: 'error' };
      }
    },
  },
  created() {
    this.debouncedTranslate = debounce(this.translateText, 500);
  },
});
</script>
