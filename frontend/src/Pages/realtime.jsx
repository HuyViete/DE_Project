import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  Science,
  Opacity,
  LocalDrink,
  Speed,
  Thermostat,
  Assessment
} from '@mui/icons-material'
import Header from '../Components/Header'

// Connect to backend socket
const SOCKET_URL = 'http://localhost:5001'

const Realtime = () => {
  const [currentData, setCurrentData] = useState(null)
  const [history, setHistory] = useState([])
  const [connected, setConnected] = useState(false)
  const [selectedLine, setSelectedLine] = useState('all')

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true
    })

    socket.on('connect', () => {
      console.log('Connected to socket server')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setConnected(false)
    })

    socket.on('sensor_update', (data) => {
      console.log('New data received:', data)

      // Update history with all data
      setHistory(prev => [data, ...prev].slice(0, 50)) // Keep last 50 records

      // Update current data display based on selection
      setCurrentData(prev => {
        // If viewing all lines, always update to show latest from any line
        if (selectedLine === 'all') return data
        // If viewing specific line, only update if data matches line
        if (data.line_id === selectedLine) return data
        return prev
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [selectedLine]) // Re-run effect if selectedLine changes to ensure logic is fresh?
  // Actually, the socket listener closure might capture old selectedLine if I'm not careful.
  // Better to use a ref for selectedLine or functional state update if logic was complex,
  // but here I'm using selectedLine inside the effect.
  // Wait, if I add selectedLine to dependency array, it will reconnect socket every time I change line.
  // That's not ideal.
  // Let's use a ref for selectedLine or filter in the render.

  // Ref approach for socket callback
  const selectedLineRef = React.useRef(selectedLine)
  useEffect(() => {
    selectedLineRef.current = selectedLine
  }, [selectedLine])

  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true })
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('sensor_update', (data) => {
      setHistory(prev => [data, ...prev].slice(0, 50))

      // Check the ref for current selection
      if (selectedLineRef.current === 'all' || data.line_id === selectedLineRef.current) {
        setCurrentData(data)
      }
    })

    return () => socket.disconnect()
  }, [])

  const getQualityColor = (score) => {
    if (score >= 7) return 'success'
    if (score >= 5) return 'warning'
    return 'error'
  }

  const SensorCard = ({ title, value, unit, icon, color }) => (
    <Card sx={{ width: 83, height: 72.5, p: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <CardContent sx={{ p: '6px !important', '&:last-child': { pb: '6px !important' } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="textSecondary" noWrap sx={{ fontWeight: 500, fontSize: '0.65rem', maxWidth: '50px' }} title={title}>
            {title}
          </Typography>
          {React.cloneElement(icon, { sx: { fontSize: 14, opacity: 0.7 } })}
        </Box>
        <Typography variant="body2" component="div" fontWeight="bold" color={color} sx={{ lineHeight: 1.2, fontSize: '0.9rem', mt: 0.5 }}>
          {value}
        </Typography>
        <Typography component="div" variant="caption" color="textSecondary" sx={{ fontSize: '0.6rem', lineHeight: 1 }}>{unit}</Typography>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Header />
      <Toolbar />
      <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Real-time Quality Monitoring
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="line-select-label">Line</InputLabel>
              <Select
                labelId="line-select-label"
                id="line-select"
                value={selectedLine}
                label="Line"
                onChange={(e) => setSelectedLine(e.target.value)}
              >
                <MenuItem value="all">All Lines</MenuItem>
                {[1, 2, 3, 4, 5, 6].map((line) => (
                  <MenuItem key={line} value={line}>Line {line}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Chip
            label={connected ? 'System Online' : 'Disconnected'}
            color={connected ? 'success' : 'error'}
            variant="outlined"
            size="small"
          />
        </Box>

        {currentData ? (
          <Grid container spacing={2}>
            {/* Top Section: AI Prediction & Sensors */}
            <Grid item xs={12}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {/* AI Prediction Cards */}
                <SensorCard
                  title="Quality Score"
                  value={currentData.quality_score?.toFixed(1)}
                  unit=""
                  icon={<Assessment color="primary" />}
                  color={getQualityColor(currentData.quality_score) + '.main'}
                />
                <SensorCard
                  title="Quality Class"
                  value={currentData.quality_class}
                  unit=""
                  icon={<Assessment color="primary" />}
                  color={getQualityColor(currentData.quality_score) + '.main'}
                />

                {/* Sensor Data Cards */}
                <SensorCard
                  title="Alcohol"
                  value={currentData.alcohol}
                  unit="%"
                  icon={<LocalDrink color="primary" />}
                  color="primary.main"
                />
                <SensorCard
                  title="pH Level"
                  value={currentData.pH}
                  unit=""
                  icon={<Science color="secondary" />}
                  color="secondary.main"
                />
                <SensorCard
                  title="Density"
                  value={currentData.density}
                  unit="g/cm³"
                  icon={<Opacity color="info" />}
                  color="info.main"
                />
                <SensorCard
                  title="Fixed Acidity"
                  value={currentData['fixed acidity']}
                  unit="g/dm³"
                  icon={<Thermostat color="action" />}
                  color="text.primary"
                />
                <SensorCard
                  title="Vol. Acidity"
                  value={currentData['volatile acidity']}
                  unit="g/dm³"
                  icon={<Thermostat color="error" />}
                  color="error.main"
                />
                <SensorCard
                  title="Citric Acid"
                  value={currentData['citric acid']}
                  unit="g/dm³"
                  icon={<LocalDrink color="warning" />}
                  color="warning.main"
                />
                <SensorCard
                  title="Res. Sugar"
                  value={currentData['residual sugar']}
                  unit="g/dm³"
                  icon={<Science color="success" />}
                  color="success.main"
                />
                <SensorCard
                  title="Chlorides"
                  value={currentData.chlorides}
                  unit="g/dm³"
                  icon={<Science color="error" />}
                  color="error.main"
                />
                <SensorCard
                  title="Free SO₂"
                  value={currentData['free sulfur dioxide']}
                  unit="mg/dm³"
                  icon={<Speed color="info" />}
                  color="info.main"
                />
                <SensorCard
                  title="Total SO₂"
                  value={currentData['total sulfur dioxide']}
                  unit="mg/dm³"
                  icon={<Speed color="primary" />}
                  color="primary.main"
                />
                <SensorCard
                  title="Sulphates"
                  value={currentData.sulphates}
                  unit="g/dm³"
                  icon={<Science color="warning" />}
                  color="warning.main"
                />
              </Box>
            </Grid>

            {/* History Table */}
            <Grid item xs={12}>
              <Paper sx={{ width: '100%', overflow: 'hidden', mt: 1 }}>
                <Box p={2} pb={1}>
                  <Typography variant="h6" component="div">
                    Recent Readings Log
                  </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
                  <Table stickyHeader size="small" aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        {selectedLine === 'all' && <TableCell>Line</TableCell>}
                        <TableCell>Product ID</TableCell>
                        <TableCell>Batch ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Quality</TableCell>
                        <TableCell align="right">Alcohol</TableCell>
                        <TableCell align="right">pH</TableCell>
                        <TableCell align="right">Density</TableCell>
                        <TableCell align="right">Fixed Acidity</TableCell>
                        <TableCell align="right">Vol. Acidity</TableCell>
                        <TableCell align="right">Citric</TableCell>
                        <TableCell align="right">Sugar</TableCell>
                        <TableCell align="right">Chlorides</TableCell>
                        <TableCell align="right">Free SO₂</TableCell>
                        <TableCell align="right">Total SO₂</TableCell>
                        <TableCell align="right">Sulphates</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {history
                        .filter(row => selectedLine === 'all' || row.line_id === selectedLine)
                        .map((row, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{new Date(row.timestamp).toLocaleTimeString()}</TableCell>
                            {selectedLine === 'all' && (
                              <TableCell>
                                <Chip label={`Line ${row.line_id}`} size="small" variant="outlined" />
                              </TableCell>
                            )}
                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {row.product_id || `L${row.line_id}B${row.batch_id}P${row.product_number}`}
                            </TableCell>
                            <TableCell>{row.batch_id}</TableCell>
                            <TableCell sx={{ textTransform: 'capitalize' }}>
                              <Chip
                                label={row.type}
                                size="small"
                                color={row.type === 'red' ? 'error' : 'default'}
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={row.quality_score?.toFixed(1)}
                                color={getQualityColor(row.quality_score)}
                                size="small"
                                sx={{ height: 20, fontSize: '0.75rem', fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell align="right">{row.alcohol}</TableCell>
                            <TableCell align="right">{row.pH}</TableCell>
                            <TableCell align="right">{row.density}</TableCell>
                            <TableCell align="right">{row['fixed acidity']}</TableCell>
                            <TableCell align="right">{row['volatile acidity']}</TableCell>
                            <TableCell align="right">{row['citric acid']}</TableCell>
                            <TableCell align="right">{row['residual sugar']}</TableCell>
                            <TableCell align="right">{row.chlorides}</TableCell>
                            <TableCell align="right">{row['free sulfur dioxide']}</TableCell>
                            <TableCell align="right">{row['total sulfur dioxide']}</TableCell>
                            <TableCell align="right">{row.sulphates}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <LinearProgress sx={{ width: '50%' }} />
            <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
              Waiting for sensor stream...
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Realtime
