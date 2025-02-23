import React, { useState } from 'react';
import { Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CookieSettings = ({ onSave }) => {
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

  const handleSave = () => {
    if (onSave) {
      onSave(cookies); // Passa as preferências de cookies para o componente pai
    }
    navigate(-1); // Volta para a rota anterior após salvar
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
            disabled // Cookies essenciais não podem ser desativados
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
        label="Cookies de Análise (Google Analytics)"
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
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '20px' }}>
        Salvar e Voltar
      </Button>
    </div>
  );
};

export default CookieSettings;