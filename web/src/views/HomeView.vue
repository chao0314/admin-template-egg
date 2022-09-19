<template>
  <div class="home">
    <el-container>
      <el-header>
        <img src="../assets/home.png" alt="">
        <div class="home__header-right">
          <img src="../assets/avatar.png" alt="">
          <span>用户名</span>
          <el-button>退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="100px">
          <home-menu></home-menu>
        </el-aside>
        <el-main>
          <home-main></home-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup lang="ts">
// const props = withDefaults(defineProps<{}>(), {})
import HomeMenu from '../components/home/HomeMenu.vue';
import HomeMain from '../components/home/HomeMain.vue';
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
}

.home__header-right {
  min-width: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style>