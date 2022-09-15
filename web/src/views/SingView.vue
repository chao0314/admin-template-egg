<template>
  <el-dialog :model-value="true"
             :show-close="false"
             :title="title"
             :close-on-press-escape="false"
             :close-on-click-modal="false"
  >
    <router-view></router-view>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import type {Locale} from "@/locale/zh-cn";
import {useRoute} from "vue-router";

const locale = inject<Locale>('locale');
const route = useRoute();
const title = computed(() => {
  const name = route.name;
  if (name && locale) return locale[name as keyof Locale];
  else return locale?.singIn;
})
</script>

<style scoped>

</style>