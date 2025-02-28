import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme, 
  useMediaQuery,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip
} from '@mui/material';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdsDashboard = ({ ads }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [adTypeData, setAdTypeData] = useState({
    labels: [],
    datasets: []
  });
  
  const [clicksViewsData, setClicksViewsData] = useState({
    labels: [],
    datasets: []
  });
  
  const [priorityData, setPriorityData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    if (!ads || ads.length === 0) return;
    
    // Preparar dados para gráfico de tipo de anúncios
    const adTypes = {};
    ads.forEach(ad => {
      if (adTypes[ad.adType]) {
        adTypes[ad.adType]++;
      } else {
        adTypes[ad.adType] = 1;
      }
    });
    
    setAdTypeData({
      labels: Object.keys(adTypes),
      datasets: [
        {
          label: 'Quantidade por Tipo',
          data: Object.values(adTypes),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    });
    
    // Preparar dados para gráfico de clicks e views
    const topAds = [...ads]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    
    // Labels responsivas com base no tamanho da tela
    const labelLength = isMobile ? 5 : isTablet ? 8 : 10;
    
    setClicksViewsData({
      labels: topAds.map(ad => ad.title.substring(0, labelLength) + (ad.title.length > labelLength ? '...' : '')),
      datasets: [
        {
          label: 'Visualizações',
          data: topAds.map(ad => ad.views),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Cliques',
          data: topAds.map(ad => ad.clicks),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    });
    
    // Preparar dados para gráfico de prioridade
    setPriorityData({
      labels: ads.slice(0, 5).map(ad => ad.title.substring(0, labelLength) + (ad.title.length > labelLength ? '...' : '')),
      datasets: [
        {
          label: 'Prioridade',
          data: ads.slice(0, 5).map(ad => ad.finalPriority),
          tension: 0.1,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    });
    
  }, [ads, isMobile, isTablet]);

  // Calcular estatísticas gerais
  const totalAds = ads?.length || 0;
  const totalClicks = ads?.reduce((sum, ad) => sum + ad.clicks, 0) || 0;
  const totalViews = ads?.reduce((sum, ad) => sum + ad.views, 0) || 0;
  const averageCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0;
  const activeAds = ads?.filter(ad => ad.isActive).length || 0;

  // Configurações responsivas para os gráficos com base no breakpoint
  const getChartOptions = (isDetailedLegend = false) => {
    const legendPosition = isMobile ? 'bottom' : isDetailedLegend ? 'right' : 'top';
    const fontSize = isMobile ? 9 : 11;
    const maxRotation = isMobile ? 45 : 30;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: legendPosition,
          labels: {
            boxWidth: isMobile ? 8 : 12,
            font: {
              size: fontSize
            }
          }
        },
        tooltip: {
          titleFont: {
            size: fontSize + 1
          },
          bodyFont: {
            size: fontSize
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: maxRotation,
            minRotation: 0,
            font: {
              size: fontSize
            }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: fontSize
            }
          }
        }
      }
    };
  };

  // Se não há dados, mostrar mensagem
  if (!ads || ads.length === 0) {
    return <Box sx={{ textAlign: 'center', p: 4 }}>Carregando dados ou nenhum anúncio encontrado.</Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      
      {/* Cards de estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'} gutterBottom>
                Total de Anúncios
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} component="p" sx={{ fontWeight: 'bold' }}>
                {totalAds}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'} gutterBottom>
                Anúncios Ativos
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} component="p" sx={{ fontWeight: 'bold' }}>
                {activeAds}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'} gutterBottom>
                Total de Cliques
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} component="p" sx={{ fontWeight: 'bold' }}>
                {totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography color="text.secondary" variant={isMobile ? 'caption' : 'body2'} gutterBottom>
                CTR Médio
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} component="p" sx={{ fontWeight: 'bold' }}>
                {averageCTR}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Grade de gráficos mais flexível com MUI Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Gráfico de pizza para tipos de anúncios */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Distribuição por Tipo
              </Typography>
              <Box sx={{ height: 180 }}>
                <Pie 
                  data={adTypeData} 
                  options={getChartOptions(true)} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Gráfico de barras para views/cliques */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Top 5 - Views vs Cliques
              </Typography>
              <Box sx={{ height: 180 }}>
                <Bar data={clicksViewsData} options={getChartOptions()} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Gráfico de linha para prioridade */}
        <Grid item xs={12} md={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Prioridade dos Anúncios
              </Typography>
              <Box sx={{ height: 180 }}>
                <Line data={priorityData} options={getChartOptions()} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabela de anúncios recentes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Anúncios Recentes
          </Typography>
          <TableContainer component={Paper}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>Views</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>Cliques</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>CTR</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ads.slice(0, 5).map((ad, index) => {
                  // Tamanho do título baseado no breakpoint
                  const titleLength = isMobile ? 10 : isTablet ? 12 : 15;
                  const displayTitle = ad.title.length > titleLength ? 
                    `${ad.title.substring(0, titleLength)}...` : ad.title;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{displayTitle}</TableCell>
                      <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{ad.adType}</TableCell>
                      <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{ad.views}</TableCell>
                      <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>{ad.clicks}</TableCell>
                      <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.875rem' }}>
                        {ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : 0}%
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={ad.isActive ? 'Ativo' : 'Inativo'} 
                          size={isMobile ? "small" : "medium"}
                          color={ad.isActive ? "success" : "error"}
                          variant="outlined"
                          sx={{ fontSize: isMobile ? '0.65rem' : '0.75rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdsDashboard;