<script setup lang="ts">
import {useRoute} from "vuepress/client";
import {Breadcrumb as ThemeBreadcrumb} from "vuepress-theme-plume";
import {isHomeOrIndex} from "../utils/breadcrumb.ts";

const route = useRoute();
</script>

<template>
    <ThemeBreadcrumb v-if="!isHomeOrIndex(route.path)" />
</template>
