interface Media {
  _id: string;
  url: string;
  publicId: string;
  createdAt: string;
  __v: number;
}
interface Showtimes {
  date: string;
  times: string[];
}
export  interface MovieDetails {
  _id: string;
  name: string;
  photo: Media;
  trailer: Media;
  landmark: string;
  city: string;
  state: string;
  genres: string[];
  language: string;
  showtimes: Showtimes[];
  country: string;
  createdAt: string;
  __v: number;
}
  
  export interface UseMoviesReturn {
    movies: MovieDetails[];
    loading: boolean;
    error: string | null;
    fetchMoreMovies: () => void;
  }
 export  const formatDate = (dateString :any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    console.log(day,month,year)
    return `${day}/${month}/${year}`;
  };
