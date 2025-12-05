import React from 'react'
import { Box, Container, Typography, Toolbar } from '@mui/material'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'

function Dashboard() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Tester Dashboard
        </Typography>
        <Typography color="text.secondary">
          Welcome to the Tester Dashboard. View and perform quality tests.
        </Typography>
      </Container>
      <Footer />
    </Box>
  )
}

export default Dashboard