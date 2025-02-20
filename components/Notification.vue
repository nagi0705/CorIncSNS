<template>
    <div v-if="message" class="notification" :class="type">
        {{ message }}
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        message: String,
        type: {
            type: String,
            default: "success"
        }
    }
});
</script>

<style scoped>
.notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1000;
}

.success {
    background: green;
}

.error {
    background: red;
}
</style>