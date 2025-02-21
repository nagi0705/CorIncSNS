<template>
    <div class="file-uploader">
        <!-- ファイル選択ボタン -->
        <input type="file" @change="handleFileUpload" accept="image/*,video/*" />

        <!-- プレビューエリア -->
        <div v-if="previewUrl" class="preview">
            <img v-if="isImage" :src="previewUrl" alt="画像プレビュー" class="preview-image" />
            <video v-if="isVideo" :src="previewUrl" controls class="preview-video"></video>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            previewUrl: "",
            isImage: false,
            isVideo: false,
        };
    },
    methods: {
        async handleFileUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const fileType = file.type;
            if (fileType.startsWith("image/")) {
                this.isImage = true;
                this.isVideo = false;
            } else if (fileType.startsWith("video/")) {
                this.isImage = false;
                this.isVideo = true;
            }

            this.previewUrl = URL.createObjectURL(file);

            // 🔥 自動アップロード処理を追加
            await this.uploadFile(file);
        },

        async uploadFile(file: File) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await this.$axios.$post("/api/upload", formData);
                this.$emit("upload-success", response.fileUrl); // 🔥 親コンポーネントにURLを渡す
            } catch (error) {
                console.error("アップロード失敗:", error);
                alert("アップロードに失敗しました ❌");
            }
        }
    }
});
</script>

<style scoped>
.preview-image {
    width: 100%;
    /* コンテナの幅いっぱいに広がる */
    max-width: 400px;
    /* 最大幅を制限 */
    border-radius: 5px;
    margin-top: 10px;
    display: block;
    /* ボタンが画像の下に配置されるようにする */
}

.preview-video {
    width: 100%;
    max-width: 400px;
    margin-top: 10px;
}

.file-uploader {
    margin-bottom: 20px;
    /* 下に余白を確保 */
}
</style>