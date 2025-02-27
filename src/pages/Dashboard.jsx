import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, business } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Verifica se a tela é pequena
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar a visibilidade do Sidebar

  // Função para alternar a visibilidade do Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh', // Ocupa toda a altura da tela
        width: '100%', // Ocupa toda a largura da tela
      }}
    >
      {/* Sidebar */}
      <Sidebar isMobile={isMobile} sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Conteúdo Principal */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%', // Ocupa toda a largura disponível
        }}
      >
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Conteúdo abaixo do Header */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px', // Ajuste para o Header fixo
            overflowY: 'auto', // Permite rolagem do conteúdo
            width: '100%', // Ocupa toda a largura disponível
          }}
        >
          <Typography variant="h4" gutterBottom>
            Bem-vindo, {user ? user.name : 'Usuário'}!
          </Typography>
          <Typography variant="body1">
            Você está acessando o plano: {business ? business.planType : 'N/A'}
          </Typography>
          {/* Área Dinâmica para as Rotas Internas */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;