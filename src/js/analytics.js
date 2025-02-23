import axios from 'axios';

document.addEventListener("DOMContentLoaded", async () => {
    let clientId = document.cookie.split('; ').find(row => row.startsWith('clientId='))?.split('=')[1];

    if (!clientId) {
        try {
            await axios.get('/set-cookie'); // Chama a API usando Axios
            console.log('Novo clientId criado.');
        } catch (error) {
            console.error('Erro ao salvar clientId:', error);
        }

        // Tenta pegar o clientId novamente após definir o cookie
        clientId = document.cookie.split('; ').find(row => row.startsWith('clientId='))?.split('=')[1] || 'unknown';
    }

    // Envia um evento de visualização de página para o Google Analytics
    gtag('event', 'page_view', { clientId });

    // Captura cliques em anúncios
    document.querySelectorAll('.ad').forEach(ad => {
        ad.addEventListener('click', () => {
            gtag('event', 'ad_click', { 
                adID: ad.dataset.adId, 
                clientId 
            });
        });
    });
});