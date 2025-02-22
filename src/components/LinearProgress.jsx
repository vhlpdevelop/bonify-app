import * as React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearTimer({ duration = 5 }) {
  const [progress, setProgress] = React.useState(0);
  const [tempoRestante, setTempoRestante] = React.useState(duration);

  React.useEffect(() => {
    // Reinicia os estados sempre que `duration` mudar
    setProgress(0);
    setTempoRestante(duration);

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const newProgress = Math.min((elapsedTime / (duration * 1000)) * 100, 100);
      const newTempoRestante = Math.max(Math.ceil((endTime - now) / 1000), 0);

      setProgress(newProgress);
      setTempoRestante(newTempoRestante);

      if (newProgress >= 100) {
        clearInterval(timer);
      }
    }, 100);

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