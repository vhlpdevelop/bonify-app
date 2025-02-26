// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o estado de loading
    setError(''); // Limpa mensagens de erro anteriores

    try {
      const response = await axios.post('https://bonify-api-production.up.railway.app/user/login', credentials); // Substitua pela URL da sua API
      console.log(response)
      if(response.ok){
        const { token } = response.data;

      // Salva o token no localStorage
      localStorage.setItem('token', token);

      // Redireciona para a dashboard
      navigate('/dashboard');
      }else{
        console.log("ERRO FOI OCASIONADO, LOGIN FALHOU")
      }
      
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.'); // Exibe mensagem de erro
      console.error('Erro ao fazer login:', err);
    } finally {
      setLoading(false); // Desativa o estado de loading, independentemente do resultado
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <Typography variant="h4" gutterBottom>
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
      backgroundColor: 'primary.dark', // Escurece o botão ao passar o mouse
    },
  }}
>
  {loading ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    'Entrar'
  )}
</Button>
      </form>
    </Box>
  );
};

export default Login;