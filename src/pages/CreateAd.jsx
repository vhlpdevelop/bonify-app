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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
} from '@mui/material';
import createAds from '../services/createAds';

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
    duration: 5, // Duração padrão de 5 segundos
  });
  const [imageUrl, setImageUrl] = useState(null); // Estado para armazenar a URL da imagem
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Limites de caracteres
  const limits = {
    title: 40,
    description: 100,
    cta_text: 25,
    dst_url: 100,
    imageSize: 5 * 1024 * 1024, // 5MB em bytes
  };

  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};

    // Validação do título (sempre obrigatório)
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length > limits.title) {
      newErrors.title = `O título deve ter no máximo ${limits.title} caracteres.`;
    }

    // Validação da descrição (sempre obrigatória)
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length > limits.description) {
      newErrors.description = `A descrição deve ter no máximo ${limits.description} caracteres.`;
    }

    // Validação da imagem (sempre obrigatória)
    if (!formData.image) {
      newErrors.image = 'Imagem é obrigatória';
    } else if (formData.image.size > limits.imageSize) {
      newErrors.image = 'A imagem deve ter no máximo 5MB.';
    }

    // Validação do CTA text (obrigatório se cta_active estiver ativo)
    if (formData.cta_active && !formData.cta_text.trim()) {
      newErrors.cta_text = 'Texto do CTA é obrigatório quando o CTA está ativo.';
    } else if (formData.cta_text.length > limits.cta_text) {
      newErrors.cta_text = `O texto do CTA deve ter no máximo ${limits.cta_text} caracteres.`;
    }

    // Validação da URL de destino (obrigatória se dst_active estiver ativo)
    if (formData.dst_active && !formData.dst_url.trim()) {
      newErrors.dst_url = 'URL de destino é obrigatória quando o destino está ativo.';
    } else if (formData.dst_url && !/^(https?:\/\/)/.test(formData.dst_url)) {
      newErrors.dst_url = 'A URL deve começar com http:// ou https://';
    } else if (formData.dst_url.length > limits.dst_url) {
      newErrors.dst_url = `A URL deve ter no máximo ${limits.dst_url} caracteres.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Verifica o tamanho da imagem
        if (file.size > limits.imageSize) {
          setErrors((prev) => ({
            ...prev,
            image: 'A imagem deve ter no máximo 5MB.',
          }));
          return; // Impede o processamento da imagem
        }
        // Converte a imagem para Base64
        const base64 = await convertToBase64(file);
        setFormData((prev) => ({
          ...prev,
          [name]: file, // Armazena o arquivo original
          imageBase64: base64, // Armazena a imagem em Base64
        }));
        setImageUrl(URL.createObjectURL(file)); // Cria uma URL para a imagem selecionada
        setErrors((prev) => ({ ...prev, image: '' })); // Limpa o erro de tamanho
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Função para converter arquivo para Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Se houver erros, não envia o formulário
    }

    setLoading(true);

    try {
      const sender = {
        cta_active : formData.cta_active,
        cta_text:formData.cta_text,
        description:formData.description,
        title:formData.title,
        dst_active:formData.dst_active,
        dst_url:formData.dst_url,
        duration:formData.duration,
        imageUrl:formData.imageBase64
      }
      // Simulação de envio para a API
      console.log('Dados enviados:', sender);
      // Aqui você chamaria a função createAds(sender) para enviar os dados
      const adsData = await createAds(sender);
      if (adsData.ok) {
        // Atualiza o localStorage com os novos dados
        const storedAds = JSON.parse(localStorage.getItem('ads')) || [];
        const updatedAds = storedAds.map(a => 
          a._id === ad._id ? { ...a, ...adsData.data } : a // Usa adsData.data para atualizar
        );
        localStorage.setItem('ads', JSON.stringify(updatedAds));
        setLoading(false);
        navigate('/dashboard/adSettings');
      }else{
        console.log("Erro ocorreu ==>")
        console.log(adsData.message)
      }
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      setErrors({ submit: 'Erro ao criar anúncio. Tente novamente.' });
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Criar Novo Anúncio
      </Typography>

      {/* Pré-visualização do anúncio */}
      {imageUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Card sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: 400, 
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              <img
                src={imageUrl}
                alt="Pré-visualização do anúncio"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              
              {/* CTA Text na imagem */}
              {formData.cta_active && formData.cta_text && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  {formData.cta_text}
                </Box>
              )}
            </Box>

            {/* Título e Descrição */}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', mb: 2 }}>
                {formData.title || "Título do Anúncio"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textAlign: 'center',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {formData.description || "Descrição do anúncio. Este texto será truncado após três linhas."}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        {/* Campo Título */}
        <TextField
          fullWidth
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title || `${formData.title.length}/${limits.title} caracteres`}
          margin="normal"
          required
          inputProps={{ maxLength: limits.title }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          O título do anúncio, que aparecerá como cabeçalho.
        </Typography>

        {/* Campo Descrição */}
        <TextField
          fullWidth
          label="Descrição"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description || `${formData.description.length}/${limits.description} caracteres`}
          margin="normal"
          required
          multiline
          rows={4}
          inputProps={{ maxLength: limits.description }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          A descrição do anúncio, que aparecerá abaixo do título.
        </Typography>

        {/* Campo URL de Destino */}
        <TextField
          fullWidth
          label="URL de Destino"
          name="dst_url"
          value={formData.dst_url}
          onChange={handleChange}
          error={!!errors.dst_url}
          helperText={errors.dst_url || `${formData.dst_url.length}/${limits.dst_url} caracteres`}
          margin="normal"
          inputProps={{ maxLength: limits.dst_url }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          A URL para onde o usuário será redirecionado ao clicar no anúncio.
        </Typography>

        {/* Campo Texto do CTA */}
        <TextField
          fullWidth
          label="Texto do CTA"
          name="cta_text"
          value={formData.cta_text}
          onChange={handleChange}
          error={!!errors.cta_text}
          helperText={errors.cta_text || `${formData.cta_text.length}/${limits.cta_text} caracteres`}
          margin="normal"
          inputProps={{ maxLength: limits.cta_text }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          O texto do botão de Call to Action (CTA) que aparecerá na imagem.
        </Typography>

        {/* Checkbox CTA Ativo */}
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
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Marque para ativar o botão de Call to Action (CTA) no anúncio.
        </Typography>

        {/* Checkbox Destino Ativo */}
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
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Marque para ativar o redirecionamento para a URL de destino.
        </Typography>

        {/* Campo Duração da Propaganda */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="duration-label">Duração da Propaganda</InputLabel>
          <Select
            labelId="duration-label"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            label="Duração da Propaganda"
          >
            <MenuItem value={5}>5 segundos</MenuItem>
            <MenuItem value={10}>10 segundos</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Escolha a duração que o anúncio ficará visível (5 ou 10 segundos).
        </Typography>

        {/* Campo Upload de Imagem */}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          style={{ margin: '16px 0' }}
          required
        />
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Selecione uma imagem para o anúncio. Recomenda-mos tamanho 640x480 px Formatos suportados: JPEG, JPG, PNG, GIF.
        </Typography>

        {/* Mensagens de erro */}
        {errors.image && (
          <Typography color="error" gutterBottom>
            {errors.image}
          </Typography>
        )}
        {errors.submit && (
          <Typography color="error" gutterBottom>
            {errors.submit}
          </Typography>
        )}

        {/* Botão de envio */}
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