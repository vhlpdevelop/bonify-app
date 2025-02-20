import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
const welcome = () => {
    return (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ bgcolor: 'background.default', p: 3 }}
    >
        <Card>
            <CardContent>
             <Typography variant="h5" component="div">
                                 BEM-VINDO
             
                                 </Typography>
            </CardContent>
        </Card>
    </Box>
    );
  };
  
  export default welcome;