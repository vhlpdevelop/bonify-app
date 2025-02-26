import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'], // Eixo X
  datasets: [
    {
      label: 'Vendas', // Legenda do gráfico
      data: [4000, 3000, 2000, 2780, 1890, 2390, 3490], // Eixo Y
      borderColor: '#8884d8', // Cor da linha
      backgroundColor: 'rgba(136, 132, 216, 0.2)', // Cor de fundo sob a linha
      fill: true, // Preenche a área sob a linha
      tension: 0.4, // Suaviza a linha
    },
  ],
};

const options = {
  responsive: true, // Torna o gráfico responsivo
  plugins: {
    legend: {
      position: 'top', // Posição da legenda
    },
    title: {
      display: true,
      text: 'Vendas Mensais', // Título do gráfico
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Inicia o eixo Y a partir de zero
    },
  },
};

const LineChartComponent = () => {
  return (
    <div style={{ width: '600px', height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChartComponent;