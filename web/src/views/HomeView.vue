<template>
  <div class="home">
    <el-container>
      <el-header>
        <img src="../assets/home.png" alt="">
        <div class="home__header-right">
          <img src="../assets/avatar.png" alt="" @click="handleUserInfo">
          <span>{{ locale.username }}</span>
          <el-button>{{ locale.singOut }}</el-button>
        </div>
        <upload-avatar-dialog></upload-avatar-dialog>
      </el-header>
      <el-container>
        <home-menu></home-menu>
        <home-main></home-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup lang="ts">
import {inject} from "vue";
import HomeMenu from '../components/home/HomeMenu.vue';
import HomeMain from '../components/home/HomeMain.vue';
import UploadAvatarDialog from '../components/common/UploadAvatarDialog.vue';
import type {Locale} from "@/locale/zh-cn";
// const props = withDefaults(defineProps<{}>(), {})
const locale = inject<Locale>('locale');


</script>

<style scoped>

.home:deep(.el-header) {
  background: #12b7f5;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.home:deep(.el-header) img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.home__header-right {
  min-width: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style>