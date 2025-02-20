import axios from 'axios';

const getAds = async (params) => {
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
        const response = await axios.post('ttps://bonify-api-production.up.railway.app/hotspot/getAds', formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        console.log(response)
        if (response.status === 200) {
            console.log('Propagandas buscadas!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao buscar propagandas');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default getAds