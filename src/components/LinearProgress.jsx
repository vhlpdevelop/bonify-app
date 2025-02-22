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
  value: PropTypes.number.isRequired,
};

export default function LinearTimer({ duration = 5 }) {
  const [progress, setProgress] = React.useState(100);
  const [tempoRestante, setTempoRestante] = React.useState(duration);

  React.useEffect(() => {
    // Reinicia o timer quando a duration muda
    setProgress(100);
    setTempoRestante(duration);
    
    const incrementValue = 100 / duration;
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress - incrementValue;
        return newProgress >= 0 ? newProgress : 0;
      });
      
      setTempoRestante((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]); // Executa novamente quando duration muda

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
      <Typography variant="body2" sx={{ 
        color: 'text.secondary', 
        textAlign: 'center', 
        mt: 1 
      }}>
        {`Tempo restante: ${tempoRestante}s`}
      </Typography>
    </Box>
  );
}

LinearTimer.propTypes = {
  duration: PropTypes.number
};