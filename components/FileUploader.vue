<template>
    <div class="file-uploader">
        <input type="file" @change="handleFileUpload" accept="image/*,video/*" />

        <!-- プレビューエリア -->
        <div v-if="previewUrl" class="preview">
            <img v-if="isImage" :src="previewUrl" alt="画像プレビュー" class="preview-image" @click="openModal" />
            <video v-if="isVideo" :src="previewUrl" controls class="preview-video"></video>
        </div>

        <!-- モーダル -->
        <Modal v-if="isModalOpen" :isOpen="isModalOpen" @close="closeModal">
            <img v-if="isImage" :src="previewUrl" alt="拡大プレビュー" class="modal-image" />
            <video v-if="isVideo" :src="previewUrl" controls class="modal-video"></video>
        </Modal>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Modal from "@/components/Modal.vue";

export default Vue.extend({
    components: { Modal },
    data() {
        return {
            previewUrl: "",
            isImage: false,
            isVideo: false,
            isModalOpen: false
        };
    },
    methods: {
        handleFileUpload(event: Event) {
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
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
        }
    }
});
</script>

<style scoped>
.preview-image {
    width: 100%;
    max-width: 300px;
    border-radius: 5px;
    cursor: pointer;
}

.modal-image,
.modal-video {
    max-width: 80%;
}
</style>