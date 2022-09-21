<template>

  <el-menu
      class="home-menu"
      :default-active="defaultActive"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
  >
    <el-menu-item index="-1">
      <el-button v-if="isCollapse"
                 @click="isCollapse = false"
                 class="menu__collapse-button"
      >
        <el-icon>
          <DArrowRight/>
        </el-icon>
      </el-button>
      <template v-if="!isCollapse" #title>
        <el-button type="primary"
                   @click="isCollapse = true"
                   class="menu__collapse-button"
        >
          <el-icon>
            <DArrowLeft/>
          </el-icon>
        </el-button>
      </template>
    </el-menu-item>
    <el-sub-menu index="user">
      <template #title>
        <el-icon>
          <HomeFilled/>
        </el-icon>
        <span>{{ locale.userManagement }}</span>
      </template>
      <el-menu-item index="user/list">
        <el-icon>
          <User/>
        </el-icon>
        <template #title>
          {{ locale.userList }}
        </template>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="permission">
      <template #title>
        <el-icon>
          <List/>
        </el-icon>
        <span>{{ locale.permissionManagement }}</span>
      </template>
      <el-menu-item index="permission/role">
        <el-icon>
          <View/>
        </el-icon>
        <template #title>
          {{ locale.roleList }}
        </template>
      </el-menu-item>
      <el-menu-item index="permission/list">
        <el-icon>
          <Unlock/>
        </el-icon>
        <template #title>
          {{ locale.permissionList }}
        </template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>

</template>

<script setup lang="ts">
import {computed, inject, ref} from 'vue';
import {useRouter} from "vue-router";
import {
  DArrowLeft,
  DArrowRight,
  HomeFilled,
  User,
  List,
  View,
  Unlock
} from '@element-plus/icons-vue';
import type {Locale} from "@/locale/zh-cn";

const router = useRouter();
// const props = withDefaults(defineProps<{}>(), {})
const locale = inject<Locale>('locale');
const isCollapse = ref(false);

const defaultActive = computed(() => router.currentRoute.value.fullPath.slice(1))
const handleOpen = (key: string, keyPath: string[]) => {
  console.log('open', key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log('close', key, keyPath)
}
const handleSelect = (key: string, keyPath: string[]) => {

  if (key !== '-1') router.push(`/${key}`)

}


</script>

<style scoped>
.home-menu {
  height: calc(100vh - 100px);
}

.home-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.menu__collapse-button {
  width: 100%;
  border: none;
}

</style>