import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { AppDispatch } from '../store';
import { searchMovies } from '../searchSlice';
import axiosInstance from '../axiosConfig';

const useMovies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const fetchMoreMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('api/movies/movieList'); // Replace with your actual API endpoint
  
      setMovies(response?.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, []);

  const performSearch = useCallback((query: string) => {
    if (query.trim() !== '') {
      setIsSearchActive(true);
      dispatch(searchMovies(query)).then((result) => {
        setSearchResults(result?.payload?.movies || []);
      });
    } else {
      setIsSearchActive(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isSearchActive) {
      fetchMoreMovies();
    }
  }, [fetchMoreMovies, isSearchActive]);

  return {
    movies: isSearchActive ? searchResults : movies,
    loading,
    error,
    fetchMoreMovies,
    performSearch,
  };
};

export default useMovies;
