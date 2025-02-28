import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import KpiCard from '../components/KPICard';
import AdsDashboard from '../components/AdsDashboard';
import axios from 'axios';

const DashboardIndex = () => {
  const [ads, setAds] = useState([]); // Estado para armazenar as propagandas
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função para buscar as propagandas da API ou do localStorage
  const fetchAds = async () => {
    try {
      setLoading(true);
      // Verifica se temos os dados no localStorage
      if (localStorage.getItem('ads')) {
        const adsData = JSON.parse(localStorage.getItem('ads'));
        setAds(adsData);
      } else {
        // Se não tiver no localStorage, poderia buscar da API aqui
        // const response = await axios.get('sua-api-endpoint');
        // const adsData = response.data;
        // setAds(adsData);
        // localStorage.setItem('ads', JSON.stringify(adsData));
      }
    } catch (error) {
      console.error('Erro ao buscar dados de anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas para os KPICards
  const calculateStats = () => {
    if (ads.length === 0) return [];

    // Total de visualizações
    const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
    
    // Total de cliques
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    
    // Taxa de conversão (CTR)
    const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;

    return [
      {
        title: 'Total de Anúncios',
        value: ads.length,
        change: `${ads.filter(ad => ad.isActive).length} ativos`
      },
      {
        title: 'Visualizações',
        value: totalViews,
        change: `${totalClicks} cliques`
      },
      {
        title: 'Taxa de Conversão',
        value: `${ctr}%`,
        change: `${totalClicks} cliques totais`
      }
    ];
  };

  // Executa a função fetchAds quando o componente é montado
  useEffect(() => {
    fetchAds();
  }, []);

  // Calcula as estatísticas com base nos anúncios
  const kpiStats = calculateStats();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Visão Geral
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        {/* Renderiza os KpiCards com estatísticas agregadas */}
        {kpiStats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <KpiCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
            />
          </Grid>
        ))}
      </Grid>
      
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Desempenho das Propagandas
        </Typography>
        
        {loading ? (
          <Typography>Carregando dados...</Typography>
        ) : ads.length > 0 ? (
          // Aqui está a correção principal: passamos o array 'ads' diretamente para o AdsDashboard
          <AdsDashboard ads={ads} />
        ) : (
          <Typography>Nenhum dado de anúncio encontrado.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardIndex;