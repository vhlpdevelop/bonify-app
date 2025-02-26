import React from 'react';
import { Typography,Box } from '@mui/material';

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>
      <Typography variant="body1">
        Configure suas preferências aqui.
      </Typography>
    </Box>
  );
};

export default Settings;