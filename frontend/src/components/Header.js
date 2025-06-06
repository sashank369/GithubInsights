import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <GitHubIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GITHUB INSIGHTS
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', md: 'block' },
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Analyze any public GitHub repository
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
