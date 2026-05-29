import api from './index'

export const orderApi = {
  getList: () => api.get('/orders/'),
  
  getDetail: (id) => api.get(`/orders/${id}/`),
  
  create: (data) => api.post('/orders/create/', data),
  
  cancel: (id) => api.post(`/orders/${id}/cancel/`)
}
