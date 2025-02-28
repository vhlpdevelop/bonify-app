import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress } from '@mui/material';
import registryInteraction from '../services/registryInteraction';
import LinearProgress from './LinearProgress';

const Advertisement = ({ ads }) => {
  const totalDuration = ads.reduce((acc, ad) => acc + ad.duration, 0);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(totalDuration);
  const [showAdvertisement, setShowAdvertisement] = useState(false);
  const [adsExibidos, setAdsExibidos] = useState([]);
  const [adClicado, setAdClicado] = useState(null); // Armazena qual anúncio foi clicado
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

  useEffect(() => {
    if (tempoRestante > 0) {
      const intervalo = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalo);
    } else {
      setShowAdvertisement(true);
    }
  }, [tempoRestante]);

  useEffect(() => {
    setAdsExibidos((prevAds) => {
      const newAd = ads[currentAdIndex];
      return prevAds.some((ad) => ad._id === newAd._id) ? prevAds : [...prevAds, newAd];
    });

    const duracaoAcumulada = ads
      .slice(0, currentAdIndex + 1)
      .reduce((acc, ad) => acc + ad.duration, 0);

    if (tempoRestante <= totalDuration - duracaoAcumulada && currentAdIndex < ads.length - 1) {
      setCurrentAdIndex((prevIndex) => prevIndex + 1);
    }
  }, [tempoRestante, currentAdIndex, ads, totalDuration]);

  const updateInteraction = async (data) => {
    try {
      console.log("Enviando interação para API:", data);
      await registryInteraction(data);
      console.log("Registro feito com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar interação:", error);
    }
  };

  const liberarAcesso = (action, clickedAd = null) => {
    return () => {
      setIsLoading(true); // Ativa o estado de carregamento
      if (clickedAd) {
        setAdClicado(clickedAd); // Salva o anúncio clicado
      }

      const adsParaEnviar = adsExibidos.map((ad) => ({
        adID: ad._id,
        duration: ad.duration,
        clicked: clickedAd && clickedAd._id === ad._id,
      }));

      updateInteraction({
        action,
        ads: adsParaEnviar,
      })
        .then(() => {
          fazerLogin();
        })
        .finally(() => {
          setIsLoading(false); // Desativa o estado de carregamento, independentemente do resultado
        });
    };
  };

  const fazerLogin = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://192.168.88.1/login';

    // Se o usuário clicou em um anúncio, usa `dst_url`, senão mantém o Google
    const destino = adClicado && adClicado.dst_active ? adClicado.dst_url : 'http://www.google.com';

    const campos = [
      { name: 'username', value: 'usuario' },
      { name: 'password', value: '' },
      { name: 'dst', value: destino },
      { name: 'popup', value: 'false' },
    ];

    campos.forEach((campo) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = campo.name;
      input.value = campo.value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Card sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
        {ads.length > 0 && (
          <>
            {/* Contêiner da imagem com botão CTA */}
            <Box sx={{ position: 'relative', width: '100%', height: 400, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                src={ads[currentAdIndex].imageUrl}
                alt={ads[currentAdIndex].title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Mantém a proporção da imagem
                }}
                onClick={() => {
                  if (ads[currentAdIndex].dst_active) {
                    liberarAcesso('click', ads[currentAdIndex])();
                  }
                }}
              />
              {/* Botão CTA */}
              {ads[currentAdIndex].cta_active && (
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
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no botão dispare o clique na imagem
                    if (ads[currentAdIndex].dst_active) {
                      liberarAcesso('click', ads[currentAdIndex])();
                    }
                  }}
                >
                  {ads[currentAdIndex].cta_text || 'Saiba mais'}
                </Box>
              )}
            </Box>

            {/* Conteúdo do card (título, descrição, progresso) */}
            <CardContent>
              {!showAdvertisement && (
                <LinearProgress totalDuration={totalDuration} tempoRestante={tempoRestante} />
              )}
              <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', mb: 2 }}>
                {ads[currentAdIndex].title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textAlign: 'center',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3, // Limita a 3 linhas
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {ads[currentAdIndex].description}
              </Typography>
            </CardContent>

            {/* Botão "Liberar Acesso" com indicador de carregamento */}
            {showAdvertisement && (
              <Box display="flex" justifyContent="center" pb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={liberarAcesso('notClick')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} /> // Spinner de carregamento
                  ) : (
                    'Liberar Acesso'
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Card>
    </Box>
  );
};

export default Advertisement;