<template>
  <div class="captcha">
    <p v-if="shouldShow" @click="handleRefreshCaptcha">
      <span v-html="src"></span>
      <span>{{ countdown }}秒</span>
    </p>
    <el-button v-else type="primary" plain @click="handleCaptcha">{{ locale.getCaptcha }}</el-button>
  </div>

</template>

<script setup lang="ts">

import {inject, ref, watch} from "vue";
import type {Locale} from "@/locale/zh-cn";

const props = withDefaults(defineProps<{

  src: string

}>(), {src: ""})

const emits = defineEmits<{

  (e: 'captcha'): void

}>()

const shouldShow = ref(false);
const locale = inject<Locale>('locale');

const countdown = ref(60);


const handleCaptcha = () => emits('captcha');

const handleRefreshCaptcha = () => emits('captcha');


let timer: any;
watch(() => props.src, (newVal) => {

  if (newVal) {
    shouldShow.value = true;
    countdown.value = 60;
    timer && clearInterval(timer);
    timer = setInterval(() => {

      if (countdown.value > 1) countdown.value--;
      else {
        shouldShow.value = false;

        clearInterval(timer);
      }

    }, 1000)
  } else shouldShow.value = false;


})


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