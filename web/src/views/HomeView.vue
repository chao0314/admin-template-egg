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
import SingIn from '../components/home/SingIn.vue';
import SingUp from '../components/home/SingUp.vue';
import {inject, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";
const locale =  inject<Locale>('locale');
const title =  ref(locale?.singIn);
</script>

<style scoped>

</style>