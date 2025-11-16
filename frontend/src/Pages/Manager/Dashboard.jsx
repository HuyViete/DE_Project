import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import Logout from '../../Components/Logout'
import Header from '../../Components/Header'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import TimelineIcon from '@mui/icons-material/Timeline'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import WineBarIcon from '@mui/icons-material/WineBar'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// Mock data - sẽ thay thế bằng API calls sau
const mockWarehouseData = {
  warehouse_id: 1,
  categories: 'Red Wine Production',
  total_lines: 3,
  active_lines: 2,
  total_batches: 15,
  total_products: 4520
}

const mockLinesData = [
  {
    line_id: 1,
    active_date: '2024-11-01',
    status: 'active',
    warehouse_id: 1,
    current_batch: 'BATCH-001',
    sensors_count: 11,
    products_today: 245
  },
  {
    line_id: 2,
    active_date: '2024-11-05',
    status: 'active',
    warehouse_id: 1,
    current_batch: 'BATCH-002',
    sensors_count: 11,
    products_today: 198
  },
  {
    line_id: 3,
    active_date: '2024-10-15',
    status: 'maintenance',
    warehouse_id: 1,
    current_batch: null,
    sensors_count: 11,
    products_today: 0
  }
]

const mockBatchesData = [
  {
    batch_id: 1,
    batch_name: 'BATCH-001',
    line_id: 1,
    start_date: '2024-11-10',
    status: 'in_progress',
    products_count: 245,
    quality_score: 8.5
  },
  {
    batch_id: 2,
    batch_name: 'BATCH-002',
    line_id: 2,
    start_date: '2024-11-12',
    status: 'in_progress',
    products_count: 198,
    quality_score: 8.2
  },
  {
    batch_id: 3,
    batch_name: 'BATCH-003',
    line_id: 1,
    start_date: '2024-11-08',
    status: 'completed',
    products_count: 500,
    quality_score: 8.8
  }
]

const mockRecentProducts = [
  {
    product_id: 4520,
    batch_id: 1,
    alcohol: 12.5,
    pH: 3.2,
    quality_status: 'good',
    timestamp: '2024-11-15 14:30:00'
  },
  {
    product_id: 4519,
    batch_id: 1,
    alcohol: 12.3,
    pH: 3.3,
    quality_status: 'good',
    timestamp: '2024-11-15 14:28:00'
  },
  {
    product_id: 4518,
    batch_id: 2,
    alcohol: 11.8,
    pH: 3.4,
    quality_status: 'warning',
    timestamp: '2024-11-15 14:25:00'
  }
]

// Stat Card Component
const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const user = useAuthStore((s) => s.user)
  const [warehouse, setWarehouse] = useState(null)
  const [lines, setLines] = useState([])
  const [batches, setBatches] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  // Simulated API calls - sẽ thay thế bằng real API sau
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API calls
      // const warehouseRes = await api.get('/warehouse/my-warehouse')
      // const linesRes = await api.get('/lines/my-lines')
      // const batchesRes = await api.get('/batches/active')
      // const productsRes = await api.get('/products/recent')

      // Mock data loading
      setTimeout(() => {
        setWarehouse(mockWarehouseData)
        setLines(mockLinesData)
        setBatches(mockBatchesData)
        setRecentProducts(mockRecentProducts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'success' },
      maintenance: { label: 'Maintenance', color: 'warning' },
      inactive: { label: 'Inactive', color: 'error' },
      in_progress: { label: 'In Progress', color: 'info' },
      completed: { label: 'Completed', color: 'success' },
      good: { label: 'Good', color: 'success' },
      warning: { label: 'Warning', color: 'warning' },
      error: { label: 'Error', color: 'error' }
    }
    const config = statusConfig[status] || { label: status, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Toolbar />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Manager Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.username}! Monitor your warehouse operations.
            </Typography>
          </Box>
          <Logout />
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Stats Cards */}
        {warehouse && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Lines"
                value={warehouse.total_lines}
                icon={<TimelineIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Lines"
                value={warehouse.active_lines}
                icon={<TimelineIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Batches"
                value={warehouse.total_batches}
                icon={<LocalShippingIcon />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Products"
                value={warehouse.total_products.toLocaleString()}
                icon={<WineBarIcon />}
                color="secondary"
              />
            </Grid>
          </Grid>
        )}

        {/* Warehouse Info */}
        {warehouse && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarehouseIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Warehouse Information
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Warehouse ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {warehouse.warehouse_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {warehouse.categories}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Production Lines" />
            <Tab label="Active Batches" />
            <Tab label="Recent Products" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Production Lines
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Line ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Active Since</TableCell>
                      <TableCell>Current Batch</TableCell>
                      <TableCell>Sensors</TableCell>
                      <TableCell align="right">Products Today</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.line_id}>
                        <TableCell>Line {line.line_id}</TableCell>
                        <TableCell>{getStatusChip(line.status)}</TableCell>
                        <TableCell>{line.active_date}</TableCell>
                        <TableCell>{line.current_batch || '-'}</TableCell>
                        <TableCell>{line.sensors_count} sensors</TableCell>
                        <TableCell align="right">{line.products_today}</TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Active Batches
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Batch Name</TableCell>
                      <TableCell>Line</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Products</TableCell>
                      <TableCell align="right">Quality Score</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batches.map((batch) => (
                      <TableRow key={batch.batch_id}>
                        <TableCell sx={{ fontWeight: 500 }}>{batch.batch_name}</TableCell>
                        <TableCell>Line {batch.line_id}</TableCell>
                        <TableCell>{batch.start_date}</TableCell>
                        <TableCell>{getStatusChip(batch.status)}</TableCell>
                        <TableCell align="right">{batch.products_count}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={batch.quality_score}
                            color={batch.quality_score >= 8.5 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            Monitor
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Products
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Alcohol %</TableCell>
                      <TableCell>pH Level</TableCell>
                      <TableCell>Quality</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentProducts.map((product) => (
                      <TableRow key={product.product_id}>
                        <TableCell>#{product.product_id}</TableCell>
                        <TableCell>{product.batch_id}</TableCell>
                        <TableCell>{product.alcohol}%</TableCell>
                        <TableCell>{product.pH}</TableCell>
                        <TableCell>{getStatusChip(product.quality_status)}</TableCell>
                        <TableCell>{product.timestamp}</TableCell>
                        <TableCell align="center">
                          <Button size="small" variant="outlined">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Alert for notifications */}
        <Alert severity="info" sx={{ mt: 3 }}>
          All data shown is mock data. Real-time monitoring will be available once database is populated with sensor data.
        </Alert>
      </Container>
    </Box>
  )
}

export default Dashboard