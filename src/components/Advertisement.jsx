import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import registryInteraction from '../services/registryInteraction';
import LinearProgress from './LinearProgress';

const Advertisement = ({ ads }) => {
  const totalDuration = ads.reduce((acc, ad) => acc + ad.duration, 0); // Soma das durações
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(totalDuration);
  const [showAdvertisement, setShowAdvertisement] = useState(false);

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
    // Atualiza o índice do anúncio quando o tempo de um termina
    const duracaoAcumulada = ads
      .slice(0, currentAdIndex + 1)
      .reduce((acc, ad) => acc + ad.duration, 0);

    if (tempoRestante <= totalDuration - duracaoAcumulada && currentAdIndex < ads.length - 1) {
      setCurrentAdIndex((prevIndex) => prevIndex + 1);
    }
  }, [tempoRestante, currentAdIndex, ads, totalDuration]);

  const updateInteraction = async (action) => {
    try {
      console.log("update interaction -> ", action);
      const adsData = await registryInteraction(action);
      console.log(adsData);
    } catch (error) {
      console.log(error);
    }
  };

  const liberarAcesso = (action) => {
    return () => {
      console.log(action);
      const params = {
        action: action,
        adID: ads[currentAdIndex]._id,
        duration: ads[currentAdIndex].duration,
      };
      updateInteraction(params).then(() => {
        console.log('Registro feito!');
        fazerLogin();
      });
    };
  };

  const fazerLogin = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://192.168.88.1/login';

    const campos = [
      { name: 'username', value: 'usuario' },
      { name: 'password', value: '' },
      { name: 'dst', value: 'http://www.google.com' },
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
    <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
      {ads.length > 0 && (
        <>
          <CardMedia
            component="img"
            src={ads[currentAdIndex].imageUrl}
            alt={ads[currentAdIndex].title}
            sx={{
              width: 320,
              height: 320, // Tamanho fixo da imagem
              objectFit: 'cover', // Mantém a proporção e cobre todo o espaço
            }}
          />
          <CardContent>
            {!showAdvertisement && <LinearProgress totalDuration={totalDuration} tempoRestante={tempoRestante} />}
            <Typography gutterBottom variant="h5" component="div">
              {ads[currentAdIndex].title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ads[currentAdIndex].description}
            </Typography>
          </CardContent>

          {showAdvertisement && (
            <Box display="flex" justifyContent="center" pb={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={liberarAcesso('notClick')}
              >
                Pular
              </Button>
            </Box>
          )}
        </>
      )}
    </Card>
  );
};

export default Advertisement;
