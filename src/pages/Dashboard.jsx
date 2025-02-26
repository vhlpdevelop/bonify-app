// src/pages/Dashboard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Bem-vindo à sua dashboard!
      </Typography>
    </Box>
  );
};

export default Dashboard;