import { Component } from 'react';
import { Rate } from 'antd';

import './Movie.css';

export default class Movie extends Component {
  constructor() {
    super();
  }

  render() {
    const { title, score, data, description, rating, image, senRatingId } = this.props;
    return (
      <>
        <div className="movie-container">
          <img className="movie-img" src={image} alt="фотка" />
          <div className="movie-description-content">
            <div className="movie-title-block">
              <h2 className="movie-title">{title}</h2>
              <div className="movie-score">{score}</div>
            </div>
            <h3 className="movie-date">{data}</h3>
            <div className="movie-category-container">
              <p className="movie-category">Action</p>
              <p className="movie-category">Drama</p>
            </div>
            <p className="movie-description">{description}</p>
            <Rate allowHalf count={10} defaultValue={rating} onChange={senRatingId} allowClear={true}/>
          </div>
        </div>
      </>
    );
  }
}
