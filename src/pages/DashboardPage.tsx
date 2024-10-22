import React, { useState } from 'react';
import { Typography, TextField, Container, Box, Button, IconButton } from '@mui/material';
import MovieAddForm from '../components/MovieAddForm';
import MovieList from '../components/MovieList';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authSlice';
import { useDispatch } from 'react-redux';
import useMovies from '../utils/useMovies';

const DashboardPage: React.FC = () => {
  const { movies, loading, error, performSearch } = useMovies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    performSearch(query);
  };
  
  const handleOpenModal = () => { 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography variant="h4">Dashboard</Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary"  onClick={handleOpenModal}>
            Add Movie
          </Button>
          <IconButton onClick={handleLogout} color="primary" sx={{ color: 'red', ml: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
      <MovieAddForm open={isModalOpen} onClose={handleCloseModal} />
      <Typography variant="h4" color="primary" gutterBottom>
       Movie List Dashboard 
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        id="search"
        label="Search movies"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
      />
      <MovieList movies={movies} loading={loading} error={error} />
    </Container>
  );
};

export default DashboardPage;
