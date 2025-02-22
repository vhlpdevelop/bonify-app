import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HotspotRedirect from './components/HotspotRedirect';
import Welcome from './components/Welcome'; //Atualizado
import CookieSettings from './components/CookieSettings'; // Importe o componente de configurações de cookies

const App = () => {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [openCookieDialog, setOpenCookieDialog] = useState(false);

  // Verifica se o usuário já deu consentimento ao carregar o app
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null) {
      setOpenCookieDialog(true); // Mostra o banner se não houver consentimento
    } else {
      setCookieConsent(consent === 'true'); // Define o estado de consentimento
    }
  }, []);

  // Função para lidar com o consentimento do usuário
  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    setCookieConsent(consent);
    setOpenCookieDialog(false);
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
          {/* Banner de Consentimento de Cookies */}
          <Dialog open={openCookieDialog} onClose={() => setOpenCookieDialog(false)}>
            <DialogTitle>Uso de Cookies</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Este site utiliza cookies para melhorar a sua experiência. Ao continuar navegando, você concorda com o uso de cookies.
                <br />
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Política de Privacidade
                </a>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleConsent(true)} color="primary">
                Aceitar
              </Button>
              <Button onClick={() => handleConsent(false)} color="secondary">
                Recusar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Rotas da Aplicação */}
          <Routes>
            <Route path="/hotspot-redirect" element={<HotspotRedirect />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/cookie-settings" element={<CookieSettings />} /> {/* Rota para configurações de cookies */}
          </Routes>

          {/* Rodapé com Link para Configurações de Cookies */}
          <footer style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', padding: '10px 0', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2">
              <a href="/cookie-settings">Configurações de Cookies</a>
            </Typography>
          </footer>
        </Router>
      </Box>
    </ThemeProvider>
  );
};

export default App;