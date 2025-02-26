import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null); // Estado para o menu do usuário

  // Função para abrir o menu do usuário
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Função para fechar o menu do usuário
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token de autenticação
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar>
        {/* Título da Página */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
          Dashboard
        </Typography>

        {/* Ícone de Notificações */}
        <IconButton color="inherit" sx={{ color: 'text.primary' }}>
          <NotificationsIcon />
        </IconButton>

        {/* Menu do Usuário */}
        <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 2 }}>
          <Avatar alt="User" src="/path/to/user-avatar.jpg" /> {/* Substitua pelo avatar do usuário */}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;