import { create } from 'zustand'
import { dashboardService } from '../Services/dashboardService'
import { warehouseService } from '../Services/warehouseService'
import { toast } from 'sonner'

export const useDashboardStore = create((set) => ({
  warehouse: null,
  lines: [],
  batches: [],
  recentProducts: [],
  warehouseInfo: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null })
    try {
      const [stats, lines, batches, products, info] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getLines(),
        dashboardService.getBatches(),
        dashboardService.getRecentProducts(),
        warehouseService.getWarehouseInfo()
      ])

      set({
        warehouse: stats,
        lines: lines,
        batches: batches,
        recentProducts: products,
        warehouseInfo: info,
        loading: false
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      set({ error: error.message, loading: false })
      toast.error('Failed to load dashboard data')
    }
  },

  generateToken: async () => {
    try {
      const data = await warehouseService.generateToken()
      set((state) => ({
        warehouseInfo: {
          ...state.warehouseInfo,
          invitation_token: data.token,
          token_expires_at: data.expiresAt
        }
      }))
      toast.success('Invitation token generated!')
    } catch (error) {
      console.error('Error generating token:', error)
      toast.error('Failed to generate token')
    }
  }
}))
