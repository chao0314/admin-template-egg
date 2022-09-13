<template>

  <el-config-provider :locale="locale">
    <app/>
  </el-config-provider>

</template>

<script setup lang="ts">
import {ElConfigProvider} from 'element-plus'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue';

const locale =  zhCn;
</script>

<style scoped>

</style>