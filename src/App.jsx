// filepath: /c:/Users/user/Desktop/Zappy project/src/App.jsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HotspotRedirect from './components/HotspotRedirect';
import Welcome from './components/welcome'
const App = () => {
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
          <Routes>
            <Route path="/hotspot-redirect" element={<HotspotRedirect />} />
            <Route path="/welcome"element={<Welcome />} />
          </Routes>
        </Router>
      </Box>

    </ThemeProvider>
  );
};

export default App;