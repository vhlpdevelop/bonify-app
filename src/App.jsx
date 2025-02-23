import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HotspotRedirect from './components/HotspotRedirect';
import CookieSettings from './components/CookieSettings';
import PrivacyPolicy from './components/PrivacyPolicy';
import { initGA, trackPageView } from './js/analytics'; // Importa as funções de rastreamento

const App = () => {
  const [cookieConsent, setCookieConsent] = useState({
    essential: true, // Cookies essenciais (sempre ativos)
    analytics: false, // Cookies de análise (Google Analytics)
    marketing: false, // Cookies de marketing
  });
  const [openCookieBanner, setOpenCookieBanner] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const location = useLocation(); // Hook para obter a localização atual
  const navigate = useNavigate(); // Hook para navegação

  // Verifica se o usuário já deu consentimento ao carregar o app
  useEffect(() => {
    const consent = JSON.parse(localStorage.getItem('cookieConsent'));
    if (consent === null) {
      setOpenCookieBanner(true); // Mostra o banner se não houver consentimento
    } else {
      setCookieConsent(consent); // Define o estado de consentimento
    }
  }, []);

  // Inicializa o Google Analytics se o usuário consentir com cookies de análise
  useEffect(() => {
    if (cookieConsent.analytics) {
      initGA('G-FX9LLWKZMH'); // Substitua pelo seu ID de rastreamento
    }
  }, [cookieConsent.analytics]);

  // Rastreia a visualização da página se o usuário consentir com cookies de análise
  useEffect(() => {
    if (cookieConsent.analytics) {
      trackPageView(location.pathname);
    }
  }, [location, cookieConsent.analytics]);


  const handleSaveCookiePreferences = (preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setCookieConsent(preferences);
  };

  // Função para lidar com o consentimento do usuário
  const handleConsent = (consent) => {
    const newConsent = {
      essential: true, // Cookies essenciais sempre ativos
      analytics: consent, // Cookies de análise baseados no consentimento
      marketing: false, // Cookies de marketing (opcional)
    };
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    setCookieConsent(newConsent);
    setOpenCookieBanner(false);
    setSnackbarOpen(true); // Mostra um feedback visual
  };

  // Fecha o Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Ocultar o banner de cookies na página de configurações de cookies
  const showCookieBanner = openCookieBanner && location.pathname !== '/cookie-settings';

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
        {/* Rotas da Aplicação */}
        <Routes>
          <Route path="/hotspot-redirect" element={<HotspotRedirect />} />
          <Route
            path="/cookie-settings"
            element={<CookieSettings onSave={handleSaveCookiePreferences} />}
          /> {/* Rota para configurações de cookies */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* Rota para política de privacidade */}
        </Routes>

        {/* Banner de Cookies como Footer */}
        {showCookieBanner && (
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
            <Button onClick={() => navigate('/cookie-settings')} color="primary" sx={{ marginLeft: '10px' }}>
              Configurações de Cookies
            </Button>
          </Box>
        )}

        {/* Snackbar para Feedback */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Preferências de cookies salvas com sucesso!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default App;