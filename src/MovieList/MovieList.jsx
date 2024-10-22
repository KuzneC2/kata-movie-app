import { Component } from 'react';
import Movie from '../Movie/Movie';
import { Spin } from 'antd';
import { Alert } from 'antd';

import './MovieList.css';

export default class MovieList extends Component {
  constructor() {
    super();
  }
  onClose = e => {
    console.log(e, 'I was closed.');
  };
  render() {
    const { moviesData, loading, error } = this.props;
    const errorMessage = error ? (
      <Alert message="Что-то пошло не так, попробуйте снова..." type="error" />
    ) : null;
    const loadComponent = loading ? <Spin /> : null;
    const moviesComponent = !loading
      ? moviesData.map(movie => (
          <Movie
            key={movie.id}
            title={movie.title}
            score={movie.score}
            data={movie.data}
            description={movie.description}
            rate={movie.rate}
            image={movie.image}
            
          />
        ))
      : null;

    return (
      <>
        <div className="movie-list">
          {errorMessage}
          {loadComponent}
          {moviesComponent}
        </div>
      </>
    );
  }
}
