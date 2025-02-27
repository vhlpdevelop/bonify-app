import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Switch, FormControlLabel } from '@mui/material';

const AdEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState({ title: '', description: '', isActive: true });

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
    const selectedAd = storedAds.find(ad => ad.id === parseInt(id));
    if (selectedAd) setAd(selectedAd);
  }, [id]);

  const handleSave = () => {
    const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
    const updatedAds = storedAds.map(a => 
      a.id === ad.id ? { ...a, ...ad } : a
    );
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    navigate('/dashboard/adSettings');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editar Anúncio
      </Typography>
      
      <TextField
        label="Título"
        value={ad.title}
        onChange={(e) => setAd({ ...ad, title: e.target.value })}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Descrição"
        value={ad.description}
        onChange={(e) => setAd({ ...ad, description: e.target.value })}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <FormControlLabel
        control={
          <Switch
            checked={ad.isActive}
            onChange={(e) => setAd({ ...ad, isActive: e.target.checked })}
          />
        }
        label="Anúncio Ativo"
        sx={{ mt: 2 }}
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSave}
        sx={{ mt: 3 }}
      >
        Salvar
      </Button>
    </Box>
  );
};

export default AdEdit;