import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteIcon from '@mui/icons-material/Delete';

const AdSettings = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
    setAds(storedAds);
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/adSettings/edit/${id}`);
  };

  const handleToggleStatus = (id) => {
    const updatedAds = ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    );
    setAds(updatedAds);
    localStorage.setItem('ads', JSON.stringify(updatedAds));
  };

  const handleDelete = (id) => {
    const updatedAds = ads.filter(ad => ad.id !== id);
    setAds(updatedAds);
    localStorage.setItem('ads', JSON.stringify(updatedAds));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configurações de Anúncios
      </Typography>
      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item key={ad.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {ad.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={ad.isActive ? "success.main" : "error.main"} 
                  gutterBottom
                >
                  {ad.isActive ? "Ativo" : "Inativo"}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton onClick={() => handleEdit(ad.id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleToggleStatus(ad.id)}
                    color={ad.isActive ? "success" : "error"}
                  >
                    <ToggleOffIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(ad.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdSettings;