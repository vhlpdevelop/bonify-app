// filepath: /C:/Users/user/Desktop/Zappy project/zappy-project/src/components/Advertisement.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import registryInteraction from '../services/registryInteraction';

const Advertisement = ({ ads, params }) => {
    const [showAdvertisement, setShowAdvertisement] = useState(false);
  const Propaganda = ({ username, redirect }) => {
    useEffect(() => {
      const video = document.getElementById('propaganda');
      video.addEventListener('ended', liberarAcesso);

      const timer = setTimeout(() => {
        setShowAdvertisement(true);
      }, ads.duration*1000); //milissegundos


      return () => clearTimeout(timer);
    }, [location]);
  }
  const updateInteraction = async (action) => {
    try {
      const adsData = await registryInteraction(action); // Busca as propagandas
    } catch (error) {
      console.log(error)
      console.log(error.message)
    }
  };


  const liberarAcesso = (action) => {
    console.log(action)
    updateInteraction(action).then(() => {
      console.log('Registro feito!');
      fazerLogin();
    })
  }

  const fazerLogin = () => {
    // Cria um formulário dinamicamente
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://192.168.88.1/login'; // URL de login do MikroTik

    // Adiciona os campos do formulário
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

    // Adiciona o formulário ao corpo da página e o envia
    document.body.appendChild(form);
    form.submit();
  };


  return (
    <Card sx={{ maxWidth: 345 }}>
      {ads.map((ad, index) => (
        <div key={index}>
          <CardMedia
            component="img"
            height="320"
            src={ad.imageUrl}
            alt={ad.title}
            onClick={liberarAcesso('click')}
          />
          <CardContent>

            <Typography gutterBottom variant="h5" component="div">
              {ad.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ad.description}
            </Typography>
          </CardContent>
          <Box display="flex" justifyContent="center" pb={2}>
           {showAdvertisement &&<Button variant="contained" color="primary" onClick={liberarAcesso('notClick')}>
              Pular
            </Button>}
          </Box>
        </div>
      ))}
    </Card>
  );
};

export default Advertisement;