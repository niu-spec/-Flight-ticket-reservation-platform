import api from './index'

export const paymentApi = {
  create: (orderId, data) => api.post(`/payments/create/${orderId}/`, data),
  
  getDetail: (id) => api.get(`/payments/${id}/`)
}
