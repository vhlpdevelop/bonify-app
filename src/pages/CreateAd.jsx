import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import  createAds from '../services/createAds'; // Serviço para criar anúncios

const CreateAd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dst_url: '',
    cta_text: '',
    cta_active: false,
    dst_active: false,
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.dst_url.trim()) {
      newErrors.dst_url = 'URL de destino é obrigatória';
    } else if (!/^(https?:\/\/)/.test(formData.dst_url)) {
      newErrors.dst_url = 'URL inválida';
    }
    if (!formData.cta_text.trim()) {
      newErrors.cta_text = 'Texto do CTA é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return; // Se houver erros, não envia o formulário
    }
  
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dst_url', formData.dst_url);
      formDataToSend.append('cta_text', formData.cta_text);
      formDataToSend.append('cta_active', formData.cta_active);
      formDataToSend.append('dst_active', formData.dst_active);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
  
      const response = await createAds(formDataToSend); // Envia os dados para a API
  
      if (response.ok) {
        // Recupera os anúncios existentes do localStorage
        const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
  
        // Adiciona o novo anúncio ao array de anúncios
        const newAd = response.data; // Supondo que a API retorne o anúncio criado em response.data
        const updatedAds = [...storedAds, newAd];
  
        // Atualiza o localStorage com o novo array de anúncios
        localStorage.setItem('ads', JSON.stringify(updatedAds));
  
        navigate('/dashboard/adSettings'); // Redireciona após o sucesso
      } else {
        setErrors({ submit: 'Erro ao criar anúncio. Tente novamente.' });
      }
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      setErrors({ submit: 'Erro ao criar anúncio. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Criar Novo Anúncio
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Descrição"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="URL de Destino"
          name="dst_url"
          value={formData.dst_url}
          onChange={handleChange}
          error={!!errors.dst_url}
          helperText={errors.dst_url}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Texto do CTA"
          name="cta_text"
          value={formData.cta_text}
          onChange={handleChange}
          error={!!errors.cta_text}
          helperText={errors.cta_text}
          margin="normal"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="cta_active"
              checked={formData.cta_active}
              onChange={handleChange}
              color="primary"
            />
          }
          label="CTA Ativo"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="dst_active"
              checked={formData.dst_active}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Destino Ativo"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          style={{ margin: '16px 0' }}
        />
        {errors.submit && (
          <Typography color="error" gutterBottom>
            {errors.submit}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Criar Anúncio'}
        </Button>
      </form>
    </Box>
  );
};

export default CreateAd;