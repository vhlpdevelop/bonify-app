import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import KpiCard from '../components/KPICard';
import LineChart from '../components/LineChart';
import axios from 'axios';

const DashboardIndex = () => {
  const [ads, setAds] = useState([]); // Estado para armazenar as propagandas
  const [chartData, setChartData] = useState({ labels: [], datasets: [] }); // Estado para os dados do gráfico

  // Função para buscar as propagandas da API
  const fetchAds = async () => {
    if(localStorage.getItem('ads')) {
      const adsData = JSON.parse(localStorage.getItem('ads'));
      setAds(adsData);
      processChartData(adsData);
      return;
    }
  };

  // Função para processar os dados das propagandas para o gráfico
  const processChartData = (adsData) => {
    // Extrai as datas e os valores de visualizações (ou cliques)
    const labels = adsData.map((ad) => new Date(ad.createdAt).toLocaleDateString()); // Eixo X: Datas
    const viewsData = adsData.map((ad) => ad.views); // Eixo Y: Visualizações
    const clicksData = adsData.map((ad) => ad.clicks); // Eixo Y: Cliques

    // Estrutura os dados para o gráfico
    const datasets = [
      {
        label: 'Visualizações',
        data: viewsData,
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha para visualizações
        fill: false,
      },
      {
        label: 'Cliques',
        data: clicksData,
        borderColor: 'rgba(153, 102, 255, 1)', // Cor da linha para cliques
        fill: false,
      },
    ];

    // Atualiza o estado do gráfico
    setChartData({ labels, datasets });
  };

  // Executa a função fetchAds quando o componente é montado
  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Visão Geral
      </Typography>
      <Grid container spacing={3} mb={4}>
        {/* Renderiza os KpiCards dinamicamente com base nas propagandas */}
        {ads.map((ad, index) => (
          <Grid item xs={12} md={4} key={index}>
            <KpiCard
              title={ad.title}
              value={`${ad.views} visualizações`} // Exemplo de valor
              change={`${ad.clicks} cliques`} // Exemplo de mudança
            />
          </Grid>
        ))}
      </Grid>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Desempenho das Propagandas
        </Typography>
        {/* Renderiza o LineChart com os dados processados */}
        <LineChart data={chartData} />
      </Paper>
    </Box>
  );
};

export default DashboardIndex;