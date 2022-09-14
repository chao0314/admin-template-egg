<template>

  <el-config-provider :locale="locale">
    <app/>
  </el-config-provider>

</template>

<script setup lang="ts">
import {ElConfigProvider} from 'element-plus'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue';
import {locale as loc} from './locale/zh-cn';
import type {Locale} from './locale/zh-cn';
import {provide} from "vue";

const locale = zhCn;

provide<Locale>('locale', loc);

</script>

<style scoped>

</style>