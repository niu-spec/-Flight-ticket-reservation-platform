import api from './index'

export const flightApi = {
  getList: (params) => api.get('/flights/', { params }),
  
  getDetail: (id) => api.get(`/flights/${id}/`),
  
  search: (data) => api.post('/flights/search/', data),
  
  updateStatus: (id, status) => api.post(`/flights/${id}/update-status/`, { status })
}
