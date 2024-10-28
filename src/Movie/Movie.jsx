import React, { useContext } from 'react';
import { Rate } from 'antd';
import { GenreContext } from '../movie-serviece-context/movie-service-context';

import './Movie.css';

const Movie = (props) => {
  const renderColorScore = score => {
    let color;
    if (score > 7) {
      color = 'movie-score movie-score-green';
    } else if (score >= 5 && score <= 7) {
      color = 'movie-score movie-score-yellow';
    } else if (score >= 3 && score < 5) {
      color = 'movie-score movie-score-orange';
    } else if (score < 3) {
      color = 'movie-score movie-score-red';
    }
    return color;
  };

  const genresArr = useContext(GenreContext);

  const { title, score, data, description, rating, image, senRatingId, genres } = props;

  const arrGenreFinish = genresArr ? genresArr.filter(genre => genres.includes(genre.id)) : [];

  const genresComponent = arrGenreFinish.map((el, index) => {
    return (
      <p key={index} className="movie-category">
        {el.name}
      </p>
    );
  });

  return (
    <div className="movie-container">
      <img className="movie-img" src={image} alt="фотка" />
      <div className="movie-description-content">
        <div className='movie-immage-title-block'>
          <img className='image-block' src={image} alt="фото фильма" />
          <div className='title-block'>

        <div className="movie-title-block">   
          <h2 className="movie-title">{title}</h2>
          <div className={renderColorScore(score)}>{score}</div>
        </div>
        <h3 className="movie-date">{data}</h3>
        <div className="movie-category-container">{genresComponent}</div>
          </div>
        </div>


        <p className="movie-description">{description}</p>
        <Rate allowHalf count={10} defaultValue={rating} onChange={senRatingId} allowClear={true} />
      </div>
    </div>
  );
}

export default Movie;