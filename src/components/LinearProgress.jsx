import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearTimer({ duration = 5 }) {
  const [progress, setProgress] = React.useState(0);
  const [tempoRestante, setTempoRestante] = React.useState(duration);

  React.useEffect(() => {
    // Reinicia os estados quando a duração muda
    setProgress(0);
    setTempoRestante(duration);

    const incrementValue = 100 / duration;
    
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + incrementValue, 100));
      setTempoRestante((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {/* Barra de progresso */}
      <LinearProgress variant="determinate" value={progress} />

      {/* Texto do tempo restante */}
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        {`Tempo restante: ${tempoRestante}s`}
      </Typography>
    </Box>
  );
}

LinearTimer.propTypes = {
  duration: PropTypes.number,
};