import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    user.value = response.user
    token.value = response.token
    localStorage.setItem('token', response.token)
    return response
  }

  const register = async (userData) => {
    const response = await authApi.register(userData)
    user.value = response.user
    token.value = response.token
    localStorage.setItem('token', response.token)
    return response
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  const fetchProfile = async () => {
    if (token.value) {
      const response = await authApi.getProfile()
      user.value = response
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    fetchProfile
  }
})
