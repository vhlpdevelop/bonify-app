import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import KpiCard from '../components/KpiCard';
import LineChart from '../components/LineChart';

const DashboardIndex = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Visão Geral
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <KpiCard title="Total de Vendas" value="R$ 50.000" change="+10%" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard title="Usuários Ativos" value="1.200" change="+5%" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard title="Novos Pedidos" value="85" change="+15%" />
        </Grid>
      </Grid>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Vendas Mensais
        </Typography>
        <LineChart />
      </Paper>
    </Box>
  );
};

export default DashboardIndex;