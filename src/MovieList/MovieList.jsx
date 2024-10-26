import { Component } from 'react';
import Movie from '../Movie/Movie';
import { Alert, Pagination, Spin } from 'antd';

import './MovieList.css';

export default class MovieList extends Component {
  constructor() {
    super();
  }
  onClose = e => {
    console.log(e, 'I was closed.');
  };
  render() {
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
    } = this.props;

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
      />
    ));

    const errorMessage = error ? <Alert message="Что-то пошло не так, попробуйте снова..." type="error" /> : null;
    const loadComponent = loading ? <Spin /> : null;

    const moviesComponentContent = !displayRated ? movieDataList : movieDataRatedList;
    const moviesComponent = !loading ? moviesComponentContent : null;
    
    

    return (
      <>
        <div className="movie-list">{moviesComponent}</div>
        <div className="movie-container-list">
          {errorMessage}
          {loadComponent}
          <Pagination
            align="center"
            defaultCurrent={1}
            сurrent={paginateValue}
            total={`${totalPages}0`}
            onChange={num => changeNumberPage(num)}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  }
}
