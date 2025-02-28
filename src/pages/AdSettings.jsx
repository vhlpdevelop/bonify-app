import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add'; // Ícone de "+"
import updateAds from '../services/updateAds';
import deleteAds from '../services/deleteAds';
const AdSettings = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [adsLimit, setAdsLimit] = useState(0); // Estado para armazenar o limite de anúncios

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
    setAds(storedAds);

    // Recupera o objeto `business` do localStorage
    const business = JSON.parse(localStorage.getItem('business')) || {};
    // Extrai o valor de `ads_quantity` do objeto `business`
    const businessAdsQuantity = parseInt(business.ads_quantity, 10) || 0;
    setAdsLimit(businessAdsQuantity);
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/adSettings/edit/${id}`);
  };

  const handleToggleStatus = async (id) => {
    setLoading(true);

    const ad = ads.find(ad => ad._id === id);
    if (!ad) {
      setLoading(false);
      return;
    }

    const adData = {
      _id: ad._id,
      title: ad.title,
      description: ad.description,
      isActive: !ad.isActive,
      cta_active: ad.cta_active,
      cta_text: ad.cta_text,
      dst_url: ad.dst_url,
      dst_active: ad.dst_active,
      imageUrl: ad.imageUrl,
    };

    try {
      const adsData = await updateAds(adData);

      if (adsData.ok) {
        const updatedAds = ads.map(ad =>
          ad._id === id ? { ...ad, isActive: !ad.isActive } : ad
        );
        setAds(updatedAds);
        localStorage.setItem('ads', JSON.stringify(updatedAds));
      }
    } catch (error) {
      console.error('Erro ao atualizar o anúncio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setAdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async() => {
    if (adToDelete) {
      console.log(adToDelete)
      const adsData = await deleteAds(adToDelete);
      if(adsData.ok){
        const updatedAds = ads.filter(ad => ad._id !== adToDelete);
      setAds(updatedAds);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      setAdToDelete(null);
      }else{
        console.log("Ocorreu um erro")
      }
      
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setAdToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleCreateAd = () => {
    navigate('/dashboard/adSettings/createAd'); // Redireciona para a página de criação de anúncios
  };

  // Verifica se o botão de criar anúncio deve estar desabilitado
  const isCreateButtonDisabled = ads.length >= adsLimit;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configurações de Anúncios
      </Typography>
      <Grid container spacing={3}>
        {ads.map((ad) => (
          <Grid item key={ad._id} xs={12} sm={6} md={4}>
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
                  <IconButton onClick={() => handleEdit(ad._id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleToggleStatus(ad._id)}
                    color={ad.isActive ? "success" : "error"}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : <ToggleOffIcon />}
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(ad._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Botão de Criar Anúncio */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleCreateAd}
        disabled={isCreateButtonDisabled} // Desabilita o botão se o limite for atingido
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* Diálogo de Confirmação */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Você tem certeza que deseja deletar este anúncio? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Não
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdSettings;