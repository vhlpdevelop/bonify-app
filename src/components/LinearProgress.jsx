import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(100); // Inicia em 100%
  const [tempoRestante, setTempoRestante] = React.useState(5); // Temporizador de 5 segundos

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const novoProgresso = prevProgress - 20; // Diminui 20% a cada segundo
        return novoProgresso >= 0 ? novoProgresso : 0; // Não permite que o progresso seja menor que 0
      });

      setTempoRestante((prevTempo) => (prevTempo > 0 ? prevTempo - 1 : 0)); // Atualiza o tempo restante
    }, 1000); // Intervalo de 1 segundo

    return () => {
      clearInterval(timer); // Limpa o intervalo ao desmontar o componente
    };
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
        {`Tempo restante: ${tempoRestante}s`} {/* Exibe o tempo restante em segundos */}
      </Typography>
    </Box>
  );
}