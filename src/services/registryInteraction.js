import axios from 'axios';

const registryInteraction = async (params) => {
   
    const object ={
        'adID': params.adID,
        'action':params.action,
        'duration': params.duration
    }
    console.log(object)
    try {
        const response = await axios.post('https://bonify-api-production.up.railway.app/hotspot/registryInteraction', object)
        console.log(response)
        if (response.status === 200) {
            console.log('Registro feito!');
            return response.data; // Retorna os dados das propagandas
        } else {
            throw new Error('Erro ao registrar');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

export default registryInteraction