import { Component } from 'react';
import { Alert, Pagination } from 'antd';
import Header from '../Header/Header';
import MovieList from '../MovieList/MovieList';
import movieServiceApi from '../services/movies-servies';
import { format } from 'date-fns';
import { Offline, Online } from 'react-detect-offline';
import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      moviesData: [],
      loading: true,
      error: false,
      paginateValue: 1,
      totalPages: 1,
    };
  }

  movieService = new movieServiceApi();

  componentDidMount() {
    this.getStartApi().catch(this.getErrorMessage); //стартовый рендер фильмов на странице
  }
  //Создание стейта всех фильмов для отрисовки
  getStartApi = async () => {
    const api = await this.movieService.getResource(this.state.paginateValue);
    const moviesData = api.results.map(movie => {
      return {
        id: movie.id,
        title: movie.original_title,
        score: movie.popularity.toFixed(1),
        data: this.getCurDate(movie.release_date),
        description: this.cutDescription(movie.overview, 90),
        rate: movie.vote_average,
        image: this.getCurImg(movie.poster_path),
      };
    });

    await this.setState({
      moviesData: moviesData,
      loading: false,
      error: false,
      totalPages: api.total_pages,
    });
  };
  //получение корректного изображения, если есть
  getCurImg = url => {
    if (url) {
      return `https://image.tmdb.org/t/p/w500${url}`;
    } else {
      return 'https://avatars.mds.yandex.net/i?id=61ab8e93cef78436f9d0c9e1f3875f6ccdfaebcb_l-9035616-images-thumbs&n=13';
    }
  };
  //получение корректной даты, если она есть
  getCurDate = date => {
    if (date !== '') {
      return format(new Date(date), 'MMMM d, yyyy');
    } else {
      return date;
    }
  };
  //сокращение описания к фильму
  cutDescription = (description, maxLength) => {
    if (description.length === 0) {
      return '...';
    }
    if (description.length <= maxLength) {
      return description;
    }

    let shortenedText = description.substr(0, maxLength);
    const lastSpaceIndex = shortenedText.lastIndexOf(' ');

    if (lastSpaceIndex !== -1) {
      shortenedText = shortenedText.substr(0, lastSpaceIndex);
    }

    return shortenedText + '...';
  };
  //рендер ошибки
  getErrorMessage = err => {
    console.log(err);
    this.setState({
      error: true,
      loading: false,
    });
  };
  //изменение страницы
  changeNumberPage = async num => {
    await this.setState({
      loading: true,
      paginateValue: num,
    });
    return await this.getStartApi();
  };

  render() {
    const { moviesData, loading, error, paginateValue, totalPages } = this.state;
    return (
      <>
        <Offline>
          <Alert
            message="Пожалуйста, проверьте подключение к интернету!"
            type="warning"
          />
        </Offline>
        <Online>
          <Header />
          <main className="main">
            <MovieList
              className="MovieList"
              moviesData={moviesData}
              loading={loading}
              error={error}
            />
            <Pagination
              align="center"
              defaultCurrent={1}
              сurrent={paginateValue}
              total={`${totalPages}0`}
              onChange={num => this.changeNumberPage(num)}
              showSizeChanger={false}
            />
          </main>
        </Online>
      </>
    );
  }
}
