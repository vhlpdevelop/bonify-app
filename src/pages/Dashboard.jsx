import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box,Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext'; // Importe o hook useAuth
const Dashboard = () => {
  const { user, business } = useAuth(); // Recupera os dados do contexto
  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <Box flexGrow={1}>
        {/* Header */}
        <Header />
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {user ? user.name : 'Usuário'}!
        </Typography>
        <Typography variant="body1">
          Você está acessando o plano: {business ? business.planType : 'N/A'}
        </Typography>
        {/* Área Dinâmica para as Rotas Internas */}
        <Box p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;