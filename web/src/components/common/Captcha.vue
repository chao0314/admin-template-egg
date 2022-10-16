<template>
  <div class="captcha">
    <p v-if="src">
      <span v-html="src"></span>
      <span>{{ timer }}秒</span>
    </p>
    <el-button v-else type="primary" @click="handleCaptcha">{{ locale.getCaptcha }}</el-button>

  </div>

</template>

<script setup lang="ts">

import {inject, ref} from "vue";
import type {Locale} from "@/locale/zh-cn";

const props = withDefaults(defineProps<{

  src: string

}>(), {src: ""})

const emits = defineEmits<{

  (e: 'captcha'): void

}>()

const locale = inject<Locale>('locale');

const timer = ref(60);

const handleCaptcha = () => emits('captcha');


</script>

<style scoped>

.captcha > p {
  height: 40px;
  width: 140px;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

}

.captcha > p > span {
  display: inline-block;
  height: 40px;
  margin-left: 2px;
  vertical-align: middle;
  line-height: 40px;
}

</style>

<style>


.captcha > p > span:first-child > svg {

  display: inline-block;
  width: 100px;
  height: 40px;

}


</style>