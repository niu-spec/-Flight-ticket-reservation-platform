<template>
  <div class="home">
    <el-card>
      <h1>欢迎使用机票预约平台</h1>
      <p>快速查找航班，轻松预订机票</p>
      <el-button type="primary" size="large" @click="$router.push('/flights')">
        查询航班
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #409EFF;
  margin-bottom: 20px;
}
</style>
