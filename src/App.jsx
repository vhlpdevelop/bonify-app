import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import { Route, Routes, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import HotspotRedirect from './components/HotspotRedirect';
import CookieSettings from './components/CookieSettings';
import PrivacyPolicy from './components/PrivacyPolicy';
import { initGA, trackPageView } from './js/analytics';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardIndex from './pages/dashboard/Index'; // Página inicial da dashboard
import Reports from './pages/dashboard/Reports'; // Página de relatórios
import Settings from './pages/dashboard/Settings'; // Página de configurações
import { AuthProvider } from './context/AuthContext'; // Importe o AuthProvider

const App = () => {
  const [cookieConsent, setCookieConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [openCookieBanner, setOpenCookieBanner] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!localStorage.getItem('token');

  // Verifica consentimento ao carregar
  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    } else {
      setOpenCookieBanner(true);
    }
  }, []);

  // Inicializa GA se consentido
  useEffect(() => {
    if (cookieConsent.analytics) {
      initGA('G-FX9LLWKZMH');
      trackPageView(location.pathname); // Rastreia a página inicial
    }
  }, [cookieConsent.analytics, location.pathname]);

  // Função de consentimento unificada
  const handleConsent = (consent) => {
    const newConsent = {
      essential: true,
      analytics: consent,
      marketing: consent, // Se quiser ativar marketing junto com analytics
    };

    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    setCookieConsent(newConsent);
    setOpenCookieBanner(false);
    setSnackbarOpen(true);

    // Força novo carregamento se consentimento for dado posteriormente
    if (consent && !window.gaInitialized) {
      initGA('G-FX9LLWKZMH');
      window.gaInitialized = true;
    }
  };

  // Atualiza preferências salvas
  const handleSaveCookiePreferences = (preferences) => {
    const updatedConsent = {
      ...preferences,
      essential: true // Garante cookies essenciais
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(updatedConsent));
    setCookieConsent(updatedConsent);

    if (updatedConsent.analytics && !window.gaInitialized) {
      initGA('G-FX9LLWKZMH');
      window.gaInitialized = true;
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const showCookieBanner = openCookieBanner && location.pathname !== '/cookie-settings';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" width="100vw">
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Rota de Login */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <AuthProvider> {/* Prover contexto apenas para a dashboard e sub-rotas */}
                  <Dashboard />
                </AuthProvider>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<DashboardIndex />} /> {/* Página inicial da dashboard */}
            <Route path="reports" element={<Reports />} /> {/* Rota de relatórios */}
            <Route path="settings" element={<Settings />} /> {/* Rota de configurações */}
          </Route>
          <Route path="/hotspot-redirect" element={<HotspotRedirect />} />
          <Route path="/cookie-settings" element={<CookieSettings onSave={handleSaveCookiePreferences} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>

        {showCookieBanner && (
          <Box sx={bannerStyle}>
            <Typography variant="body2">
              Utilizamos cookies para melhorar sua experiência. 
              <a href="/privacy-policy" target="_blank" rel="noopener"> Política de Privacidade</a>
            </Typography>
            <Button onClick={() => handleConsent(true)} color="primary">Aceitar Tudo</Button>
            <Button onClick={() => handleConsent(false)} color="secondary">Recusar</Button>
            <Button onClick={() => navigate('/cookie-settings')} color="primary">Personalizar</Button>
          </Box>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert severity="success">Preferências salvas!</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  bgcolor: 'background.paper',
  p: 2,
  textAlign: 'center',
  boxShadow: 3,
};

export default App;