<template>
  <el-main>
    <el-breadcrumb separator="/"
                   class="main__breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">promotion management</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>promotion list</el-breadcrumb-item>
    </el-breadcrumb>
   <router-view></router-view>
  </el-main>
</template>

<script setup lang="ts">


</script>

<style scoped>

.main__breadcrumb {
  height: 32px;
  line-height: 32px;
  /*background: beige;*/
}

</style>
