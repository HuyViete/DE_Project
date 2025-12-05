import React from 'react'
import { Box, Container, Typography, Toolbar } from '@mui/material'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'

const Dashboard = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Engineer Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome to the Engineer Dashboard. Monitor and manage production lines.
        </Typography>
      </Container>
      <Footer />
    </Box>
  )
}

export default Dashboard