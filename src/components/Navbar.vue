<template>
  <div class="navbar">
    <div class="logo">
      <h2>机票预约平台</h2>
    </div>
    <div class="nav-links">
      <router-link to="/">首页</router-link>
      <router-link to="/flights">航班查询</router-link>
      <router-link to="/orders">我的订单</router-link>
      <router-link to="/itineraries">我的行程</router-link>
    </div>
    <div class="user-info">
      <template v-if="userStore.isLoggedIn">
        <span>{{ userStore.user?.username }}</span>
        <el-button type="text" @click="handleLogout">退出</el-button>
      </template>
      <template v-else>
        <router-link to="/login">登录</router-link>
        <router-link to="/register">注册</router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  color: white;
}

.logo h2 {
  margin: 0;
  color: white;
}

.nav-links a,
.user-info a {
  color: white;
  margin: 0 15px;
  text-decoration: none;
}

.nav-links a:hover,
.user-info a:hover {
  color: #ffd04b;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
