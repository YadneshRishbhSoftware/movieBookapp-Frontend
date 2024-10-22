import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Container, Button, TextField,IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserMovieList } from '../UsermovieListSlice';
import { AppDispatch, RootState } from '../store';
import Slider from 'react-slick';
import { MovieDetails } from '../utils/types';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { logout } from '../authSlice';
// import LocationFetcher from '../components/CurrentLocation';
import NoMoviesFound from '../components/NoMoviesFound';
// import { Theme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
const useStyles = makeStyles((theme: any) => ({
  card: {
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
  },
  cardMedia: {
    height: 200,
    objectFit: 'cover',
  },
}));

const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  const movieList = useSelector((state: RootState) => state?.userMovieList?.userMovieList);
  const [movieSearch,setMovieSearch] = React.useState<string>("");
  
  const saveScrollPosition = () => {
    localStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  // Restore scroll position when coming back to this page
  useEffect(() => {
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }
 
  }, []);

  // Fetch movie list based on search and persist scroll position before unmounting
  useEffect(() => {
    dispatch(fetchUserMovieList(movieSearch));

    // Save scroll position when unmounting (before navigating aw ay)
    return () => {
      saveScrollPosition();
    };
  }, [dispatch, movieSearch]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login');
  };
  return (
    <>
      <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
          <IconButton onClick={handleLogout} color="primary" sx={{ color: 'red', ml: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Box>
    <Container maxWidth="lg">
      {/* <LocationFetcher/> */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Now Showing
        </Typography>
        <TextField
            margin="normal"
            required
            fullWidth
            id="movieSearch"
            label="Movie Name"
            name="movieSearch"
            value={movieSearch}
            onChange={(e) => setMovieSearch(e.target.value)}
            autoFocus
          />
        <Grid container spacing={2}>
          {movieList.length > 0 ? (
            movieList?.map((movie: MovieDetails) => (
              <Grid item xs={12} sm={6} md={4} key={movie?._id}>
                <Card className={classes.card}>
                  <Slider {...settings}>
                    {movie?.photo ? (
                      <CardMedia
                        component="img"
                        className={classes.cardMedia}
                        image={(movie?.photo as { url: string })?.url}
                        alt={movie?.name}
                      />
                    ) : (
                      <CardMedia
                        component="img"
                        className={classes.cardMedia}
                        image={placeholderImage}
                        alt="No image available"
                      />
                    )}
                    {movie?.trailer ? (
                      <video controls style={{ width: '100%', height: '200px', objectFit: 'cover' }}>
                        <source src={movie?.trailer.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <CardMedia
                        component="img"
                        className={classes.cardMedia}
                        image={placeholderImage}
                        alt="No video available"
                      />
                    )}
                  </Slider>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {movie?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Landmark:</strong> {movie?.landmark} <br />
                      <strong>City:</strong> {movie?.city} <br />
                      <strong>State:</strong> {movie?.state} <br />
                      <strong>Country:</strong> {movie?.country}
                    </Typography>
                  </CardContent>
                  <Box display="flex" justifyContent="center" pb={2}>
                  <Button variant="contained" color="primary"  onClick={() => navigate("/seatBooking",{ state: movie?._id })}>
                  Book Now
                </Button>
                </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <NoMoviesFound/>
          )}
        </Grid>
      </Box>
    </Container>
    </>
  );
};

export default UserDashboardPage;
