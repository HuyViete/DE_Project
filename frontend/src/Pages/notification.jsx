import React, { useEffect, useState } from 'react'
import { useAlertStore } from '../stores/useAlertStore'
import { useAuthStore } from '../stores/useAuthStore'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'

const Notification = () => {
  const { user } = useAuthStore()
  const {
    alerts,
    fetchAlerts,
    markAsRead,
    settings,
    fetchSettings,
    saveSettings,
    connectSocket,
    disconnectSocket
  } = useAlertStore()

  const [tabValue, setTabValue] = useState(0)
  const [localSettings, setLocalSettings] = useState([])

  useEffect(() => {
    fetchAlerts()
    fetchSettings()
  }, [fetchAlerts, fetchSettings])

  useEffect(() => {
    if (user?.warehouseId) {
      connectSocket(user.warehouseId)
    }
    return () => disconnectSocket()
  }, [user, connectSocket, disconnectSocket])

  useEffect(() => {
    if (settings.length > 0) {
      // Merge with default metrics if needed, or just use what's there
      // For now, just use what's in DB. If empty, we might want to initialize defaults.
      if (settings.length === 0 && localSettings.length === 0) {
        // Initialize defaults if nothing exists
        const defaults = [
          { metric: 'quality_score', min: 5, max: 10, enabled: true },
          { metric: 'pH', min: 2.8, max: 3.8, enabled: true },
          { metric: 'alcohol', min: 8, max: 14, enabled: true },
          { metric: 'residual sugar', min: 0, max: 20, enabled: false }
        ]
        setLocalSettings(defaults)
      } else {
        setLocalSettings(settings.map(s => ({
          metric: s.metric,
          min: s.min_value,
          max: s.max_value,
          enabled: s.enabled === 1 || s.enabled === true
        })))
      }
    } else if (localSettings.length === 0) {
      // Fallback defaults
      const defaults = [
        { metric: 'quality_score', min: 5, max: 10, enabled: true },
        { metric: 'pH', min: 2.8, max: 3.8, enabled: true },
        { metric: 'alcohol', min: 8, max: 14, enabled: true },
        { metric: 'residual sugar', min: 0, max: 20, enabled: false }
      ]
      setLocalSettings(defaults)
    }
  }, [settings])

  const handleSettingChange = (index, field, value) => {
    const newSettings = [...localSettings]
    newSettings[index][field] = value
    setLocalSettings(newSettings)
  }

  const handleSaveSettings = async () => {
    await saveSettings(localSettings)
    alert('Settings saved!')
  }

  const handleMarkAllRead = () => {
    markAsRead()
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ height: 64 }} /> {/* Toolbar spacer */}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab icon={<NotificationsIcon />} label="Alerts" iconPosition="start" />
            <Tab icon={<SettingsIcon />} label="Configuration" iconPosition="start" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Paper sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
              <Typography variant="h6">Recent Alerts</Typography>
              <Button startIcon={<CheckCircleIcon />} onClick={handleMarkAllRead}>
                Mark All Read
              </Button>
            </Box>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {alerts.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No alerts found" />
                </ListItem>
              ) : (
                alerts.map((alert) => (
                  <React.Fragment key={alert.alert_id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{ bgcolor: alert.is_read ? 'transparent' : 'action.hover' }}
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight={alert.is_read ? 'normal' : 'bold'}>
                              {alert.title || 'Alert'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(alert.created_at).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {alert.description}
                            </Typography>
                            {alert.product_id && (
                              <Chip
                                label={`Product: ${alert.product_id}`}
                                size="small"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            )}
                          </React.Fragment>
                        }
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                      <ListItemSecondaryAction>
                        {!alert.is_read && (
                          <IconButton edge="end" aria-label="mark-read" onClick={() => markAsRead(alert.alert_id)}>
                            <CheckCircleIcon color="primary" />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        )}

        {tabValue === 1 && (
          <Card>
            <CardHeader
              title="Alert Threshold Configuration"
              subheader="Set the valid ranges for sensor data. Alerts will be triggered if values fall outside these ranges."
            />
            <CardContent>
              <Grid container spacing={3}>
                {localSettings.map((setting, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                            {setting.metric}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            label="Min Value"
                            type="number"
                            size="small"
                            fullWidth
                            value={setting.min || ''}
                            onChange={(e) => handleSettingChange(index, 'min', e.target.value)}
                            disabled={!setting.enabled}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TextField
                            label="Max Value"
                            type="number"
                            size="small"
                            fullWidth
                            value={setting.max || ''}
                            onChange={(e) => handleSettingChange(index, 'max', e.target.value)}
                            disabled={!setting.enabled}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={setting.enabled}
                                onChange={(e) => handleSettingChange(index, 'enabled', e.target.checked)}
                              />
                            }
                            label={setting.enabled ? 'Enabled' : 'Disabled'}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                      Save Configuration
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      <Footer />
    </Box>
  )
}

export default Notification
