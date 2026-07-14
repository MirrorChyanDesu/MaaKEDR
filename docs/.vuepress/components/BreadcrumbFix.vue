<script setup lang="ts">
import {useRoute} from "vuepress/client";
import {Breadcrumb as ThemeBreadcrumb} from "vuepress-theme-plume";

const route = useRoute();

function isHomeOrIndex(): boolean {
    const path = route.path;
    return path === "/" || path === "/zh/" || path === "/en/" || path.endsWith("/index.html");
}
</script>

<template>
    <ThemeBreadcrumb v-if="!isHomeOrIndex()" />
</template>
