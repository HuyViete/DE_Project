import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        py: 3,
        px: 3,
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" underline="hover" variant="body2" color="text.secondary">
              Privacy Policy
            </Link>
            <Link href="#" underline="hover" variant="body2" color="text.secondary">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer