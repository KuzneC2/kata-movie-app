import { useContext } from 'react';
import Movie from '../Movie/Movie';
import { Alert, Pagination, Spin } from 'antd';
import { GenreContext, GenreProvider } from '../movie-serviece-context/movie-service-context';
import './MovieList.css';

const MovieList = props => {
  const genresArr = useContext(GenreContext);

  const {
    moviesData,
    loading,
    error,
    paginateValue,
    totalPages,
    changeNumberPage,
    senRatingId,
    movieDataRated,
    displayRated,
    paginateValueRated,
  } = props;

  const movieDataList = moviesData.map(movie => (
    <Movie
      key={movie.id}
      title={movie.title}
      score={movie.score}
      data={movie.data}
      description={movie.description}
      rating={movie.rating}
      image={movie.image}
      senRatingId={rating => senRatingId(rating, movie.id)}
      genres={movie.genres}
      genresArr={genresArr}
    />
  ));

  const movieDataRatedList = movieDataRated.map(movie => (
    <Movie
      key={movie.id}
      title={movie.title}
      score={movie.score}
      data={movie.data}
      description={movie.description}
      rating={movie.rating}
      image={movie.image}
      senRatingId={rating => senRatingId(rating, movie.id)}
      genres={movie.genres}
      genresArr={genresArr}
    />
  ));

  const errorMessage = error ? <Alert message="Что-то пошло не так, попробуйте снова..." type="error" /> : null;
  const loadComponent = loading ? <Spin /> : null;

  const moviesComponentContent = !displayRated ? movieDataList : movieDataRatedList;
  const moviesComponent = !loading ? moviesComponentContent : null;

  const pagination = displayRated ? (
    <Pagination
      key={'displayRated'}
      align="center"
      сurrent={paginateValueRated}
      total={totalPages * 10}
      defaultCurrent={1}
      onChange={num => changeNumberPage(num)}
      showSizeChanger={false}
    />
  ) : (
    <Pagination
      key={'displayNotRated'}
      align="center"
      defaultCurrent={paginateValue}
      сurrent={paginateValue}
      total={totalPages * 10}
      onChange={num => changeNumberPage(num)}
      showSizeChanger={false}
    />
  );

  return (
    <>
      <GenreProvider>
        <div className="movie-list">{moviesComponent}</div>
        <div className="movie-container-list">
          {errorMessage}
          {loadComponent}
          {pagination}
        </div>
      </GenreProvider>
    </>
  );
};

export default MovieList;
