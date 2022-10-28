<template>
  <el-dialog width="30%" destroy-on-close
             v-model="dialogFormVisibleRef"
             :title="locale.uploadFile">
    <el-upload
        ref="uploadRef"
        class="file-uploader"
        :action="props.action"
        :auto-upload="false"
        :multiple="props.multiple"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
    >
      <template #trigger>
        <el-button type="primary">{{ locale.selectFile }}</el-button>
      </template>

      <!--      <el-button class="ml-3" type="success" @click="submitUpload" v-if="false">-->
      <!--        upload to server-->
      <!--      </el-button>-->

      <template #tip>
        <div class="el-upload__tip">
          {{ props.fileTypes }} , {{ locale.lessThan }} {{ props.size }}
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisibleRef = false">{{ locale.cancel }}</el-button>
        <el-button type="primary" @click="submitUpload">{{ locale.confirm }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ElMessage} from "element-plus";

const props = withDefaults(defineProps<{
  action: string,
  size?: string,
  fileTypes?: string,
  multiple?: boolean
}>(), {size: '1M', fileTypes: 'jpg/png', multiple: true})
import {inject, ref} from 'vue'
import type {UploadInstance} from 'element-plus'
import type {Locale} from "@/locale/zh-cn";
import {useHomeStore} from "@/stores/home";

const homeStore = useHomeStore();
const locale = inject<Locale>('locale');
const dialogFormVisibleRef = ref(false);
const headers = {Authorization: homeStore.getToken()};
const uploadRef = ref<UploadInstance>()


const submitUpload = () => {
  uploadRef.value!.submit();
  // dialogFormVisibleRef.value = false;
}

const handleSuccess = () => {

  dialogFormVisibleRef.value = false;

}

const handleError = (error: Error) => {

  console.log(error)
  ElMessage({
    type: 'error',
    message: locale?.error,
    offset: 100
  })

}
defineExpose({
  showDialog: () => dialogFormVisibleRef.value = true

})
</script>

<style scoped>
.file-uploader {
  text-align: center;
}


</style>