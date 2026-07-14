<template>
    <div>
        <p>Redirecting to <a href="./zh/">MaaKEDR Documentation</a>...</p>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from "vuepress/client";
import {onMounted} from "vue";

const router = useRouter();

onMounted(() => {
    router.replace("/zh/");
});
</script>
