import api from './index'

export const authApi = {
  login: (data) => api.post('/auth/login/', data),
  
  register: (data) => api.post('/auth/register/', data),
  
  logout: () => api.post('/auth/logout/'),
  
  getProfile: () => api.get('/auth/profile/'),
  
  updateProfile: (data) => api.put('/auth/profile/', data)
}
