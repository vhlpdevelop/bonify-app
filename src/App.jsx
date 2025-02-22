import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HotspotRedirect from './components/HotspotRedirect';

import CookieSettings from './components/CookieSettings'; // Importe o componente de configurações de cookies

const App = () => {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [openCookieBanner, setOpenCookieBanner] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Verifica se o usuário já deu consentimento ao carregar o app
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null) {
      setOpenCookieBanner(true); // Mostra o banner se não houver consentimento
    } else {
      setCookieConsent(consent === 'true'); // Define o estado de consentimento
    }
  }, []);

  // Função para lidar com o consentimento do usuário
  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    setCookieConsent(consent);
    setOpenCookieBanner(false);
    setSnackbarOpen(true); // Mostra um feedback visual
  };

  // Fecha o Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        border="0"
      >
        <Router>
          {/* Rotas da Aplicação */}
          <Routes>
            <Route path="/hotspot-redirect" element={<HotspotRedirect />} />  {/* Rota para redirecionamento de hotspot */}
            <Route path="/cookie-settings" element={<CookieSettings />} /> {/* Rota para configurações de cookies */}
          </Routes>

          {/* Banner de Cookies como Footer */}
          {openCookieBanner && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#f5f5f5',
                padding: '10px',
                textAlign: 'center',
                boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="body2">
                Este site utiliza cookies para melhorar a sua experiência. Ao continuar navegando, você concorda com o uso de cookies.
                <br />
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>
              </Typography>
              <Button onClick={() => handleConsent(true)} color="primary" sx={{ marginRight: '10px' }}>
                Aceitar
              </Button>
              <Button onClick={() => handleConsent(false)} color="secondary">
                Recusar
              </Button>
            </Box>
          )}

          {/* Snackbar para Feedback */}
          <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              Preferências de cookies salvas com sucesso!
            </Alert>
          </Snackbar>
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;