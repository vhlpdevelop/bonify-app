import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://bonify-api-production.up.railway.app/user/login', credentials);
      console.log(response);
      if (response.data.ok) {
        const { token, user, business, ads } = response.data;
        login(token, user, business, ads);
        navigate('/dashboard');
      } else {
        console.log('ERRO FOI OCASIONADO, LOGIN FALHOU');
        setError(response.data.msg);
      }
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
      console.error('Erro ao fazer login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Ocupa toda a altura da tela
        width: '100%', // Ocupa toda a largura da tela
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px', // Largura máxima do formulário
          padding: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Senha"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              fullWidth
            />
          </Box>
          {error && (
            <Typography color="error" variant="body2" align="center" mb={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;