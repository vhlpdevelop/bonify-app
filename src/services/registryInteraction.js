import axios from 'axios';

const registryInteraction = async (params) => {
   console.log("registryInteraction ->", params)
    
    console.log(params)
    try {
        const response = await axios.post('https://bonify-api.onrender.com/hotspot/registryInteraction', params)
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