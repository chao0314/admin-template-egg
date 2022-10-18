<template>
  <el-button type="primary" plain :disabled="countdownRef !==0" @click="handleSendCode">
    <span v-if="countdownRef ===0">发送</span>
    <span v-else>{{ countdownRef }}s</span>
  </el-button>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = withDefaults(defineProps<{

  countdown?: number

}>(), {
  countdown: 0
})

const emits = defineEmits<{
  (e: 'send-code'): void
}>()

let timer: any;
const countdownRef = ref(0);

const handleSendCode = () => {

  emits('send-code');
  countdownRef.value = props.countdown;
  timer && clearInterval(timer);
  timer = setInterval(() => {

    if (countdownRef.value > 0) countdownRef.value--;
    else clearInterval(timer);

  }, 1000)

}


</script>

<style scoped>

</style>