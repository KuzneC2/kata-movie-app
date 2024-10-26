import { Component } from 'react';
import { format } from 'date-fns';
import { Offline, Online } from 'react-detect-offline';
import { debounce } from 'lodash';

import { Alert } from 'antd';
import Header from '../Header/Header';
import MovieList from '../MovieList/MovieList';

import movieServiceApi from '../services/movies-servies';

import './App.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      displayRated: false,
      moviesData: [],
      movieDataRated: [],
      loading: true,
      error: false,
      paginateValue: 1,
      totalPages: 1,
      searchName: `return`,
      totalResults: 0,
    };
  }

  movieService = new movieServiceApi();

  //Создание стейта всех фильмов для отрисовки
  getStartApi = async () => {
    const api = await this.movieService.getResource(this.state.searchName, this.state.paginateValue);

    if (api.total_results < 1) {
      this.setState({
        loading: false,
        error: true,
        moviesData: [],
        totalResults: 0,
        totalPages: 0,
        displayRated: false,
      });
    } else {
      const moviesData = api.results.map(movie => {
        const movieRated = this.state.movieDataRated.find(el => el.id == movie.id);
        return{
          id: movie.id,
          title: movie.original_title,
          score: movie.vote_average.toFixed(1),
          data: this.getCurDate(movie.release_date),
          description: this.cutDescription(movie.overview, 90),
          rating: movieRated ? movieRated.rating : undefined,
          image: this.getCurImg(movie.poster_path),
        };
      });

      await this.setState({
        moviesData: moviesData,
        loading: false,
        error: false,
        totalPages: api.total_pages,
        totalResults: api.total_results,
      });
    }
  };

  //Отоброжение звёзд рейтинга при запуске

  // getRaitingStart = async movie => {

  //   if (movie.rate == undefined) {
  //     const rate = this.getStartRateApi().find(el => el.id == movie.id)
  //     console.log(rate)
  //     return undefined
  //   } else {
  //     return undefined;
  //   }
  // };

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

  //изменение в инпуте поиска + debounce
  debounceFunk = debounce(async e => {
    const searchValue = e.target.value;

    await this.setState({
      searchName: searchValue,
      loading: true,
    });
  }, 500);

  //получение стартового апи прорейтингированных фильмов

  getStartRateApi = async () => {
    const apiRated = await this.movieService.getRatedMovieList();
    if (apiRated == null) {
      return await this.setState({
        loading: false,
      });
    } else {
      const movieDataRated = await apiRated.results.map(movie => {
        return {
          id: movie.id,
          title: movie.original_title,
          score: movie.vote_average.toFixed(1),
          data: this.getCurDate(movie.release_date),
          description: this.cutDescription(movie.overview, 90),
          rating: movie.rating,
          image: this.getCurImg(movie.poster_path),
        };
      });
      return await this.setState({
        movieDataRated: movieDataRated,
        loading: false,
      });
    }
  };

  // изменение таблиста
  handleTabChange = async label => {
    await this.getStartRateApi();
    if (label == 'Rated') {
      await this.setState({
        displayRated: true,
        loading: true,
      });
    }
    if (label == 'Search') {
      await this.setState({
        displayRated: false,
        loading: true,
      });
    }
    await this.getStartApi();
    console.log(this.state);
  };

  // первоначальный рендер стартовых фильмов
  async componentDidMount() {
    if (
      localStorage.getItem('timeGuestSession') == undefined ||
      localStorage.getItem('guestSessionId') == undefined ||
      new Date(localStorage.getItem('timeGuestSession')) < new Date()
    ) {
      await this.movieService.createGuestSession(); //Создание новой гостевой сессии
    }

    const apiRated = await this.movieService.getRatedMovieList();
    if (apiRated == null) {
      this.setState({
        loading: false,
      });
    } else {
      const movieDataRated = apiRated.results.map(movie => {
        return {
          id: movie.id,
          title: movie.original_title,
          score: movie.vote_average.toFixed(1),
          data: this.getCurDate(movie.release_date),
          description: this.cutDescription(movie.overview, 90),
          rating: movie.rating,
          image: this.getCurImg(movie.poster_path),
        };
      });

      this.setState({
        movieDataRated: movieDataRated,
        loading: false,
      });
    }

    this.getStartApi().catch(this.getErrorMessage); //стартовый рендер фильмов на странице
    console.log(this.state);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchName !== prevState.searchName) {
      this.getStartApi();
    }
  }

  render() {
    const { moviesData, loading, error, paginateValue, totalPages, movieDataRated, displayRated } = this.state;
    return (
      <>
        <Offline>
          <Alert message="Пожалуйста, проверьте подключение к интернету!" type="warning" />
        </Offline>
        <Online>
          <Header
            changeSearchLine={this.debounceFunk}
            handleTabChange={this.handleTabChange}
            displayRated={displayRated}
          />
          <main className="main">
            <MovieList
              className="Movie-list"
              moviesData={moviesData}
              displayRated={displayRated}
              movieDataRated={movieDataRated}
              loading={loading}
              error={error}
              paginate={paginateValue}
              totalPages={totalPages}
              changeNumberPage={this.changeNumberPage}
              senRatingId={this.movieService.sendRating}
            />
          </main>
        </Online>
      </>
    );
  }
}
