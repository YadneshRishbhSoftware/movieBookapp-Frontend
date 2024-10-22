import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import useMovies from '../utils/useMovies'; // Adjust path as necessary
import Spinner from './Spinner';
import { MovieDetails } from '../utils/types';
import MovieAddModal from './MovieAddForm'; // Adjust import as necessary
import { deleteMovie } from '../movieSlice';
import Toast from './Toast';
// import { useDispatch } from 'react-redux';
// import { AppDispatch, RootState } from '../store';
import Slider from 'react-slick';
// import { AppDispatch } from '../store';
import NoMoviesFound from './NoMoviesFound';
import useMovies from '../utils/useMovies';


const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
interface MovieListProps {
  movies: MovieDetails[]; // Accepts an array of movies as a prop
  loading: boolean;       // Accepts the loading state as a prop
  error: string | null;   // Accepts any error message as a prop
}

const MovieList: React.FC<MovieListProps> = () => {
  const { movies, loading, error, fetchMoreMovies } = useMovies();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastSeverity, setToastSeverity] = React.useState<
    "success" | "error" | "info" | "warning"
  >("error");
  const [selectedMovieId, setSelectedMovieId] = React.useState<string | null>(null);

  const handleEditClick = (id: string) => {
    setSelectedMovieId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      fetchMoreMovies()
      setToastOpen(true);
      setToastMessage('Movie deleted successfully');
      setToastSeverity('success');
    } catch (error: any) {
      console.error(`Failed to delete movie: ${error.message}`);
      setToastOpen(true);
      setToastMessage(`Failed to delete movie: ${error.message}`);
      setToastSeverity('error');
    }
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const handleMovieAdded = () => {
    console.log("showList")
    fetchMoreMovies(); // Refetch movies after a new movie is added
    setIsModalOpen(false); // Close the modal after successful add
    setToastOpen(true);
    setToastMessage('Movie added successfully');
    setToastSeverity('success');
  };
  if (loading) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ flexGrow: 1, height: '100vh' }}>
    <Grid container spacing={2}>
      {movies.length >= 0 ? (
        movies.map((movie: MovieDetails) => (
          <Grid item xs={12} sm={6} md={4} key={movie?._id}>
            <Card>
              <Slider {...settings}>
                {movie?.photo ? (
                  <CardMedia
                    component="img"
                    height="auto"
                    image={(movie?.photo as { url: string })?.url}
                    alt={movie?.name}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image={placeholderImage}
                    alt="No image available"
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                {movie?.trailer ? (
                  <video
                    controls
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  >
                    <source src={movie?.trailer.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <CardMedia
                    component="img"
                    height="200"
                    image={placeholderImage}
                    alt="No video available"
                    sx={{ objectFit: 'cover' }}
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
              <CardContent>
                <IconButton onClick={() => handleEditClick(movie?._id)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(movie?._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <NoMoviesFound />
      )}
    </Grid>
    <Toast
      open={toastOpen}
      message={toastMessage}
      severity={toastSeverity}
      onClose={() => setToastOpen(false)}
    />
    <MovieAddModal
      open={isModalOpen}
      onClose={handleCloseModal}
      movieId={selectedMovieId || undefined}
      onMovieAdded={handleMovieAdded}
    />
  </Box>
  );
};

export default MovieList;
