<template>
    <div class="file-uploader">
        <input type="file" @change="handleFileUpload" accept="image/*,video/*" />
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

            console.log("選択されたファイル:", file);

            if (file.type.startsWith("image/")) {
                this.isImage = true;
                this.isVideo = false;
            } else if (file.type.startsWith("video/")) {
                this.isImage = false;
                this.isVideo = true;
            }

            this.previewUrl = URL.createObjectURL(file);
            await this.uploadFile(file);
        },

        async uploadFile(file: File) {
            const formData = new FormData();
            formData.append("file", file);

            console.log("アップロードするファイルデータ:", formData);

            try {
                const response = await this.$axios.$post("/api/upload", formData);
                console.log("アップロード成功:", response);
                this.$emit("upload-success", response.fileUrl);
            } catch (error) {
                console.error("アップロード失敗:", error);
            }
        }
    }
});
</script>