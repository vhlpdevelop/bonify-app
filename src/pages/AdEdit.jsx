import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import updateAds from '../services/updateAds';

const AdEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState({ 
    title: '', 
    description: '', 
    isActive: true,
    imageUrl: '',
    cta_active: false,
    cta_text: '',
    dst_url: '',
    dst_active: false
  });

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
    const selectedAd = storedAds.find(ad => ad._id === id);
    if (selectedAd) setAd(selectedAd);
  }, [id]);

  const handleSave = async () => {
    try {
      // Cria o objeto de dados para enviar à API
      const adData = {
        _id: ad._id,
        title: ad.title,
        description: ad.description,
        isActive: ad.isActive,
        cta_active: ad.cta_active,
        cta_text: ad.cta_text,
        dst_url: ad.dst_url,
        dst_active: ad.dst_active,
        imageUrl: ad.imageUrl, // Envia a imagem como Base64
      };
  
      // Envia os dados para a API
      const adsData = await updateAds(adData);
  
      if (adsData.ok) {
        // Atualiza o localStorage com os novos dados
        const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
        const updatedAds = storedAds.map(a => 
          a._id === ad._id ? { ...a, ...adsData.data } : a // Usa adsData.data para atualizar
        );
        localStorage.setItem('ads', JSON.stringify(updatedAds));
        navigate('/dashboard/adSettings');
      } else {
        console.error("Erro ao salvar anúncio:", adsData);
      }
    } catch (error) {
      console.error("Erro ao salvar anúncio:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Converte a imagem para Base64 e atualiza o estado
        setAd({ ...ad, imageUrl: reader.result });
      };
      reader.readAsDataURL(file); // Converte o arquivo para Base64
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editar Anúncio
      </Typography>

      {/* Exibição da Imagem do Anúncio */}
      {ad.imageUrl && (
        <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
          <img 
            src={ad.imageUrl} 
            alt="Imagem do Anúncio" 
            style={{ maxWidth: '320px', height: 'auto', borderRadius: '8px' }} 
          />
        </Box>
      )}

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

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Alterar Imagem do Anúncio, recomendado é 320x240 px</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: '8px' }}
        />
      </Box>

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

      <FormControlLabel
        control={
          <Switch
            checked={ad.cta_active}
            onChange={(e) => setAd({ ...ad, cta_active: e.target.checked })}
          />
        }
        label="CTA Ativo"
        sx={{ mt: 2 }}
      />

      <TextField
        label="Texto do CTA"
        value={ad.cta_text}
        onChange={(e) => setAd({ ...ad, cta_text: e.target.value })}
        fullWidth
        margin="normal"
      />

      <TextField
        label="URL de Destino"
        value={ad.dst_url}
        onChange={(e) => setAd({ ...ad, dst_url: e.target.value })}
        fullWidth
        margin="normal"
      />

      <FormControlLabel
        control={
          <Switch
            checked={ad.dst_active}
            onChange={(e) => setAd({ ...ad, dst_active: e.target.checked })}
          />
        }
        label="URL de Destino Ativa"
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