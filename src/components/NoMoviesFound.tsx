
import { Box, Typography } from '@mui/material';

function NoMoviesFound() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="70vh"
      mx={2}
    >
      <Typography variant="h4" color="error">
        No movies found. Please try a different search.
      </Typography>
    </Box>
  );
}

export default NoMoviesFound;