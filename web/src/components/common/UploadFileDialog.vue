<template>
  <el-dialog width="30%"
             v-model="dialogFormVisible"
             :title="locale.uploadFile">
    <el-upload
        ref="uploadRef"
        class="file-uploader"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :auto-upload="false"
        multiple
    >
      <template #trigger>
        <el-button type="primary">{{ locale.selectFile }}</el-button>
      </template>

      <el-button class="ml-3" type="success" @click="submitUpload" v-if="false">
        upload to server
      </el-button>

      <template #tip>
        <div class="el-upload__tip">
          {{ props.fileTypes }} , {{ locale.lessThan }} {{ props.size }}
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ locale.cancel }}</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">{{locale.confirm}}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: string,
  fileTypes?: string
}>(), {size: '1M', fileTypes: 'jpg/png'})
import {inject, ref} from 'vue'
import type {UploadInstance} from 'element-plus'
import type {Locale} from "@/locale/zh-cn";

const locale = inject<Locale>('locale');
const dialogFormVisible = ref(false);
const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  uploadRef.value!.submit()
}
</script>

<style scoped>
.file-uploader {
  text-align: center;
}


</style>