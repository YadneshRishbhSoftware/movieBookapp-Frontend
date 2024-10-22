// src/components/MovieAddModal.tsx
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Chip,
  MenuItem,
  IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { addMovie, getMovieById, updateMovie } from "../movieSlice";
import Toast from "./Toast";
import axios from "axios"; // Adjust import as per your project structure
import useMovies from "../utils/useMovies";
import Spinner from "./Spinner";
import { formatDate, MovieDetails } from "../utils/types";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";


const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "90vh", // Set a max height for the modal
  overflowY: "auto", // Add vertical scroll when content overflows
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const genresList = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"]; // Example genres

interface MovieAddModalProps {
  open: boolean;
  onClose: () => void;
  movieId?: string; // Add movie prop to handle edi
  onMovieAdded?: () => void ; 
}
interface Showtime {
  date: string;
  times: string[];
}
const MovieAddModal: React.FC<MovieAddModalProps> = ({
  open,
  onClose,
  movieId,
  onMovieAdded
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error, fetchMoreMovies } = useMovies();
  const movieDetails = useSelector(
    (state: RootState) => state?.movies?.movieDetails
  ) as MovieDetails | null;
console.log(onMovieAdded,"onMovieAdded")
  const [name, setName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([
    { date: "", times: [""] },
  ]);
  const [loadingForm, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("error");

  useEffect(() => {
    if (movieId) {
      dispatch(getMovieById(movieId));
    }
  }, [movieId, dispatch]);

  
  useEffect(() => {
    if (movieId && movieDetails) {
      setName(movieDetails?.name);
      setLandmark(movieDetails?.landmark);
      setCity(movieDetails?.city);
      setState(movieDetails?.state);
      setCountry(movieDetails?.country);
      setLanguage(movieDetails?.language);
      setGenres(movieDetails?.genres || []);
      console.log(movieDetails?.showtimes,"movieDetails")
      const formattedShowtimes: Showtime[] = movieDetails?.showtimes.map((showtime) => ({
        ...showtime,
        date: formatDate(showtime?.date),
      }));
      setShowtimes(formattedShowtimes);
      setPhotoPreview(
        movieDetails?.photo
          ? movieDetails?.photo.url
          : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
      );
      setTrailerPreview(
        movieDetails?.trailer
          ? movieDetails?.trailer.url
          : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
      );

    }
  }, [movieId, movieDetails]);

  const handleInputChange = (
    index: number,
    type: "date" | "time",
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    timeIndex: number | null = null
  ): void => {
    const { value } = event.target;
    const newShowtimes = [...showtimes];

    if (type === "date") {
      newShowtimes[index].date = value;
    } else if (type === "time" && timeIndex !== null) {
      newShowtimes[index].times[timeIndex] = value;
    }

    setShowtimes(newShowtimes);
  };

  // Add a new date with an empty time field
  const handleAddDate = (): void => {
    setShowtimes([...showtimes, { date: "", times: [""] }]);
  };

  // Add a new time for a specific date
  const handleAddTime = (index: number): void => {
    const newShowtimes = [...showtimes];
    newShowtimes[index].times.push("");
    setShowtimes(newShowtimes);
  };

  // Remove a specific date
  const handleRemoveDate = (index: number): void => {
    const newShowtimes = [...showtimes];
    newShowtimes.splice(index, 1);
    setShowtimes(newShowtimes);
  };

  // Remove a specific time for a date
  const handleRemoveTime = (index: number, timeIndex: number): void => {
    const newShowtimes = [...showtimes];
    newShowtimes[index].times.splice(timeIndex, 1);
    setShowtimes(newShowtimes);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTrailerFile(file);
    if (file) {
      const reader = new FileReader();
      console.log(reader,'dwqdwq')
      reader.onloadend = () => {
        setTrailerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setTrailerPreview(null);
    }
  };

  const reset = () => {
    setName("");
    setLandmark("");
    setCity("");
    setState("");
    setCountry("");
    setPhotoPreview(null);
    setTrailerPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !landmark || !city || !state || !country) {
      setToastMessage("All fields are mandatory.");
      setToastSeverity("error");
      setToastOpen(true);
      return;
    }

    setLoading(true);

    try {
      let photoPublicId = "";
      let trailerPublicId = "";
      let photoUrl = "";
      let trailerUrl = "";

      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);
        const photoResponse = await axios.post(
          "http://localhost:4000/api/upload/photo",
          formData
        );
        photoPublicId = photoResponse?.data?.publicId;
        photoUrl = photoResponse?.data?.url;
      }

      if (trailerFile) {
        const formData = new FormData();
        formData.append("trailer", trailerFile);
        const trailerResponse = await axios.post(
          "http://localhost:4000/api/upload/trailer",
          formData
        );
        trailerPublicId = trailerResponse?.data?.publicId;
        trailerUrl = trailerResponse?.data?.url;
      }

      const movieData = {
        name,
        photoPublicId,
        trailerPublicId,
        photoUrl,
        trailerUrl,
        landmark,
        city,
        state,
        country,
        language,
        genres,
        showtimes,
      };

      if (movieId) {
        const action = await dispatch(updateMovie({ id: movieId, movieData }));
        console.log(action);
        if (updateMovie.fulfilled.match(action)) {
          fetchMoreMovies();
          setToastOpen(true);
          if (onMovieAdded) {
            onMovieAdded(); // Safely invoke the callback only if it's defined
          }
          setToastMessage("Movie updated successfully");
          setToastSeverity("success");
          reset();
        } else {
          setToastOpen(true);
          setToastMessage("Failed to update movie");
          setToastSeverity("error");
        }
      } else {
        const action = await dispatch(addMovie(movieData));
        if (addMovie.fulfilled.match(action)) {
          console.log("dwqdqwd")
          fetchMoreMovies();
          if (onMovieAdded) {
            onMovieAdded(); // Safely invoke the callback only if it's defined
          }
          setToastOpen(true);
          setToastMessage("Movie added successfully");
          setToastSeverity("success");
          reset();
        } else {
          setToastOpen(true);
          setToastMessage("Failed to add movie");
          setToastSeverity("error");
        }
      }

      setToastOpen(true);
      onClose();
    } catch (error) {
      setToastMessage(" ");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !movies) return <Spinner />;
  if (error) return <div>{error}</div>;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" color="primary" gutterBottom>
          Add New Movie
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Movie Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="landmark"
            label="Landmark"
            name="landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="city"
            label="City"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="state"
            label="State"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="country"
            label="Country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="language"
            label="Language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre"
              multiple
              value={genres}
              onChange={(e) =>
                setGenres(
                  typeof e.target.value === "string"
                    ? e.target.value.split(",")
                    : e.target.value
                )
              }
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {genresList.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div>
            <h3>Add Movie Showtimes</h3>
            {showtimes.map((showtime, index) => (
              <div key={index}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid size={{ xs: 6, md: 8 }} >
                    <TextField
                      label="Select Date"
                      type="date"
                      value={showtime.date}
                      onChange={(event) =>
                        handleInputChange(index, "date", event)
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid  size={{ xs: 6, md: 8 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleAddTime(index)}
                    >
                      <AddCircleOutline />
                    </IconButton>
                    {showtimes.length > 1 && (
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveDate(index)}
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
                {showtime.times.map((time, timeIndex) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    key={timeIndex}
                  >
                    <Grid  size={{ xs: 6, md: 8 }}>
                      <TextField
                        label="Select Time"
                        type="time"
                        value={time}
                        onChange={(event) =>
                          handleInputChange(index, "time", event, timeIndex)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid  size={{ xs: 6, md: 8 }}>
                      {showtime.times.length > 1 && (
                        <IconButton
                          color="secondary"
                          onClick={() => handleRemoveTime(index, timeIndex)}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </div>
            ))}

            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddDate}
              style={{ marginTop: "20px", marginLeft: "10px" }}
            >
              Add Another Date
            </Button>
          </div>

          {photoPreview && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid >
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              </Grid>
              <Grid >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setPhotoPreview(null)}
                >
                  Remove Photo
                </Button>
              </Grid>
            </Grid>
          )}
          {trailerPreview && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid >
                <video
                  controls
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                >
                  <source src={trailerPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setTrailerPreview(null)}
                >
                  Remove Trailer
                </Button>
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2}>
            <Grid  size={{ xs: 6, md: 8 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoChange}
              />
              <label htmlFor="photo-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Photo
                </Button>
              </label>
            </Grid>
            <Grid   size={{ xs: 6, md: 8 }}>
              <input
                accept="video/*"
                style={{ display: "none" }}
                id="trailer-upload"
                type="file"
                onChange={handleTrailerChange}
              />
              <label htmlFor="trailer-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Trailer
                </Button>
              </label>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loadingForm}
          >
            {loadingForm ? <CircularProgress size={24} /> : "Add Movie"}
          </Button>
        </form>
        <Toast
          open={toastOpen}
          message={toastMessage}
          severity={toastSeverity}
          onClose={() => setToastOpen(false)}
        />
      </Box>
    </Modal>
  );
};

export default MovieAddModal;
