// filepath: /C:/Users/user/Desktop/Zappy project/zappy-project/src/components/HotspotRedirect.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Advertisement from './Advertisement';
import getAds from '../services/getAds'; // Importe a função getAds

const HotspotRedirect = () => {
    const location = useLocation();
    const [showAdvertisement, setShowAdvertisement] = useState(false);
    const [params, setParams] = useState({});
    const [ads, setAds] = useState(null); // Estado para armazenar as propagandas
    const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
    const [error, setError] = useState(null); // Estado para armazenar erros

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const mac = searchParams.get('mac');
        const ip = searchParams.get('ip');
        const hostname = searchParams.get('hostname');
        const adType = searchParams.get('adType');
        const username = searchParams.get('username');
        const linkLogin = searchParams.get('link-login');
        const linkLoginOnly = searchParams.get('link-login-only');
        const linkOrig = searchParams.get('link-orig');


        const params = { mac, ip, username, hostname, adType, linkLogin, linkLoginOnly, linkOrig, error };
        setParams(params);

        const timer = setTimeout(() => {
            setShowAdvertisement(true);
          }, 5000);
        // Process the received data here
     
        const fetchAds = async () => {
            try {
                const adsData = await getAds(params); // Busca as propagandas
                setAds(adsData); // Atualiza o estado com os dados das propagandas
                setLoading(false); // Finaliza o carregamento
            } catch (error) {
                console.log(error)
                console.log(error.message)
                setError('Erro ao carregar as propagandas.'); // Define o erro
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchAds(); // Chama a função para buscar as propagandas
        return () => clearTimeout(timer);
    }, [location]);
    
    if (error) {
        return <div>{error}</div>; // Exibe uma mensagem de erro
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{ bgcolor: 'background.default', p: 3 }}
        >
            <Card>
                <CardContent>
                    {loading && <Typography variant="h5" component="div">
                      Carregando propaganda...

                    </Typography>}
                    {ads && <Advertisement ads={ads} params={params} />} {/* Exibe o componente Advertisement */}
                </CardContent>
            </Card>
        </Box>
    );
};

export default HotspotRedirect;