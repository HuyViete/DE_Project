import { create } from 'zustand'
import { getAlerts, markRead, getSettings, updateSettings } from '../Services/alertService'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5001'

export const useAlertStore = create((set, get) => ({
  alerts: [],
  unreadCount: 0,
  settings: [],
  loading: false,
  socket: null,

  fetchAlerts: async () => {
    set({ loading: true })
    try {
      const { alerts, unreadCount } = await getAlerts()
      set({ alerts, unreadCount, loading: false })
    } catch (error) {
      console.error('Failed to fetch alerts', error)
      set({ loading: false })
    }
  },

  markAsRead: async (alertId) => {
    try {
      await markRead(alertId)
      // Optimistic update
      set((state) => {
        const newAlerts = state.alerts.map(a =>
          (alertId === undefined || a.alert_id === alertId) ? { ...a, is_read: true } : a
        )
        const newUnreadCount = alertId === undefined ? 0 : state.unreadCount - 1
        return { alerts: newAlerts, unreadCount: Math.max(0, newUnreadCount) }
      })
    } catch (error) {
      console.error('Failed to mark read', error)
    }
  },

  fetchSettings: async () => {
    try {
      const settings = await getSettings()
      set({ settings })
    } catch (error) {
      console.error('Failed to fetch settings', error)
    }
  },

  saveSettings: async (newSettings) => {
    try {
      await updateSettings(newSettings)
      set({ settings: newSettings })
    } catch (error) {
      console.error('Failed to save settings', error)
      throw error
    }
  },

  connectSocket: (warehouseId) => {
    if (get().socket) return

    const socket = io(SOCKET_URL, { withCredentials: true })

    socket.on('connect', () => {
      if (warehouseId) {
        socket.emit('join_warehouse', warehouseId)
      }
    })

    socket.on('alert_new', (newAlert) => {
      set((state) => ({
        alerts: [newAlert, ...state.alerts],
        unreadCount: state.unreadCount + 1
      }))
    })

    set({ socket })
  },

  disconnectSocket: () => {
    const socket = get().socket
    if (socket) {
      socket.disconnect()
      set({ socket: null })
    }
  }
}))
