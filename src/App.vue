<template>
  <div id="app">
    <el-container>
      <el-header>
        <navbar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  min-height: 100vh;
}

.el-header {
  background-color: #409EFF;
  padding: 0;
}

.el-main {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}
</style>
