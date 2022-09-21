<template>
  <el-dialog width="30%" center
             v-model="dialogFormVisible"
             :title="locale.changeAvatar">

    <el-upload
        class="avatar-uploader"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
      <el-icon v-else class="avatar-uploader-icon">
        <Plus/>
      </el-icon>
    </el-upload>
    <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">{{ locale.cancel }}</el-button>
              <el-button type="primary" @click="dialogFormVisible = false">{{ locale.confirm }}</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// const props = withDefaults(defineProps<{}>(), {})
import {ref, inject} from "vue";
import type {UploadProps} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import type {Locale} from "@/locale/zh-cn";

// const props = withDefaults(defineProps<{}>(), {});
const locale = inject<Locale>('locale');
const imageUrl = ref('')
const dialogFormVisible = ref(false);

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

</style>