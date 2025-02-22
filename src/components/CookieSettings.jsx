import React, { useState } from 'react';
import { Typography, Checkbox, FormControlLabel } from '@mui/material';

const CookieSettings = () => {
  const [cookies, setCookies] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  const handleChange = (event) => {
    setCookies({
      ...cookies,
      [event.target.name]: event.target.checked,
    });
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
    </div>
  );
};

export default CookieSettings;