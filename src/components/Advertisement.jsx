// filepath: /C:/Users/user/Desktop/Zappy project/zappy-project/src/components/Advertisement.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import md5 from 'md5';
import axios from 'axios';

const Advertisement = ({ params }) => {
  const Propaganda = ({ username, redirect }) => {
    useEffect(() => {
      const video = document.getElementById('propaganda');
      video.addEventListener('ended', liberarAcesso);
    }, []);
  }
  const doLogin = async () => {
   // const passwordHash = md5(''); // Substitua pela lógica de criptografia MD5

    const formData = new URLSearchParams();
    //formData.append('password', passwordHash);
    console.log(params)
    formData.append('username', params.username);
    formData.append('linkloginonly', params.linkLoginOnly);
    formData.append('linklogin', params.linkLogin);
    formData.append('linkorig', params.linkOrig);
    formData.append('dst', params.dst);
    formData.append('mac', params.mac);
    formData.append('ip', params.ip);
    formData.append('popup', 'false');

    try {
      const response = await axios.post(`http://192.168.88.22:3000/hotspot/hotspotAutorize`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*',
        },
      });
      console.log(response)
      if (response.status === 200) {
        console.log('Autenticação bem-sucedida!');
        if (response.data) {
          console.log(response.data)
          alert('Acesso liberado!');
          //window.location.href = 'http://www.google.com'; // Redireciona o usuário
      } else {
          alert('Erro ao liberar acesso.');
      }
      } else {
        console.error('Erro na autenticação.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };
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
      <CardMedia
        component="img"
        height="140"
        image="https://via.placeholder.com/345x140"
        alt="Advertisement"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Algum texto
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mais outro texto pra chamar sua atencao em 50%!
        </Typography>
      </CardContent>
      <Box display="flex" justifyContent="center" pb={2}>
        <Button variant="contained" color="primary" onClick={fazerLogin}>
          Pular
        </Button>
      </Box>
    </Card>
  );
};

export default Advertisement;