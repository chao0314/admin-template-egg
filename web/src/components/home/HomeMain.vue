<template>
  <el-main>
    <el-breadcrumb separator="/"
                   class="main__breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/index' }">{{ routeMap.index }}</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(path,index) in paths">
        <a href="" v-if="paths[index+1]">{{ routeMap[path] }}</a>
        <template v-else>{{ routeMap[path] }}</template>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <router-view></router-view>
  </el-main>
</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {inject, computed} from "vue";
import type {Locale} from "@/locale/zh-cn";

const locale = inject<Locale>('locale');
const routeMap = locale?.routeMap;
const route = useRoute();
const paths = computed(() => {

  const paths = route.fullPath.split('/').slice(1);

  return paths.map((v, i, arr) => arr[i - 1] ? `${arr[i - 1]}/${v}` : v);

});


</script>

<style scoped>

.main__breadcrumb {
  height: 32px;
  line-height: 32px;
}

</style>
