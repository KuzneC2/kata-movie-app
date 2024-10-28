import React, { createContext, useState, useEffect } from 'react';
import movieServiceApi from '../services/movies-servies';

const GenreContext = createContext();

const GenreProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieService = new movieServiceApi();
      const res = await movieService.getGenreMovies();
      console.log('Массив такой: ', res)
      setGenres(res.genres);
    };

    fetchData();
  }, []);

  return (
    <GenreContext.Provider value={genres}>
      {children}
    </GenreContext.Provider>
  );
};

export { GenreProvider, GenreContext };
