<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <button class="close-button" @click="close">×</button>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        isOpen: Boolean
    },
    methods: {
        close() {
            this.$emit("close");
        }
    }
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: transparent;
    font-size: 24px;
    cursor: pointer;
}
</style>