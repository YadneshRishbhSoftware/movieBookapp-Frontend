import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Spinner: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress color="primary" sx={{ color: theme.palette.primary.main }} />
    </Box>
  );
};

export default Spinner;
