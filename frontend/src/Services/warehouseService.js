import api from '../lib/axios'

export const warehouseService = {
  createWarehouse: async (categories) => {
    const response = await api.post('/warehouse/create', { categories })
    return response.data
  },

  joinWarehouse: async (token) => {
    const response = await api.post('/warehouse/join', { token })
    return response.data
  },

  generateToken: async () => {
    const response = await api.post('/warehouse/token')
    return response.data
  },

  getWarehouseInfo: async () => {
    const response = await api.get('/warehouse')
    return response.data
  }
}
