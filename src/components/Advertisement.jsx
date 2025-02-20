// filepath: /C:/Users/user/Desktop/Zappy project/zappy-project/src/components/Advertisement.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import md5 from 'md5';
import axios from 'axios';

const Advertisement = ({ ads, params }) => {

  const Propaganda = ({ username, redirect }) => {
    useEffect(() => {
      const video = document.getElementById('propaganda');
      video.addEventListener('ended', liberarAcesso);
    }, []);
  }

  const fazerLogin = () => {
    // Cria um formulário dinamicamente
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://192.168.88.1/login'; // URL de login do MikroTik

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
            <Button variant="contained" color="primary" onClick={fazerLogin}>
              Pular
            </Button>
          </Box>
        </div>
      ))}
    </Card>
  );
};

export default Advertisement;