import React, { useState } from 'react';
import { Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CookieSettings = () => {
  const [cookies, setCookies] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  const navigate = useNavigate(); // Hook para navegação

  const handleChange = (event) => {
    setCookies({
      ...cookies,
      [event.target.name]: event.target.checked,
    });
  };

  const handleBack = () => {
    navigate(-1); // Volta para a rota anterior
  };

  return (
    <div>
      <Typography variant="h6">Configurações de Cookies</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={cookies.essential}
            onChange={handleChange}
            name="essential"
            color="primary"
          />
        }
        label="Cookies Essenciais"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={cookies.analytics}
            onChange={handleChange}
            name="analytics"
            color="primary"
          />
        }
        label="Cookies de Análise"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={cookies.marketing}
            onChange={handleChange}
            name="marketing"
            color="primary"
          />
        }
        label="Cookies de Marketing"
      />
      <Button variant="contained" color="primary" onClick={handleBack} sx={{ marginTop: '20px' }}>
        Voltar
      </Button>
    </div>
  );
};

export default CookieSettings;