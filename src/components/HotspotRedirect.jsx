// filepath: /C:/Users/user/Desktop/Zappy project/zappy-project/src/components/HotspotRedirect.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Advertisement from './Advertisement';
const HotspotRedirect = () => {
    const location = useLocation();
    const [showAdvertisement, setShowAdvertisement] = useState(false);
    const [params, setParams] = useState({});
    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const mac = searchParams.get('mac');
        const ip = searchParams.get('ip');
        const hostname = searchParams.get('hostname');
        const username = searchParams.get('username');
        const linkLogin = searchParams.get('link-login');
        const linkLoginOnly = searchParams.get('link-login-only');
        const linkOrig = searchParams.get('link-orig');
        const error = searchParams.get('error');

        const params = { mac, ip, username, hostname, linkLogin, linkLoginOnly, linkOrig, error };
        setParams(params);

        const timer = setTimeout(() => {
            setShowAdvertisement(true);
          }, 5000);
        // Process the received data here
        console.log({ mac, ip, username, linkLogin, linkLoginOnly, linkOrig, error });
        return () => clearTimeout(timer);
    }, [location]);

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
                    {!showAdvertisement && <Typography variant="h5" component="div">
                      Carregando propaganda...

                    </Typography>}
                    {showAdvertisement && <Advertisement  params={params} />}
                </CardContent>
            </Card>
        </Box>
    );
};

export default HotspotRedirect;