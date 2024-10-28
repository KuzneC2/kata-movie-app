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
      paginateValueRated: 1,
    };
  }

  movieService = new movieServiceApi();

  //Создание стейта всех фильмов для отрисовки
  getStartApi = async () => {
    const api = await this.movieService.getResource(this.state.searchName, this.state.paginateValue);
    if (api == null) {
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
        return {
          id: movie.id,
          title: movie.original_title,
          score: movie.vote_average.toFixed(1),
          data: this.getCurDate(movie.release_date),
          description: this.cutDescription(movie.overview, 90),
          rating: localStorage.getItem(`${movie.id}`) == null ? undefined : `${localStorage.getItem(`${movie.id}`)}`,
          image: this.getCurImg(movie.poster_path),
          genres: movie.genre_ids,
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
  getErrorMessage = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  //изменение страницы
  changeNumberPage = async num => {
    if (this.state.displayRated) {
      await this.setState({
        loading: true,
        paginateValueRated: num,
      });
      console.log('Стейт рейтингованых обновился. Страница перелестнулась на ', num);
      return await this.getStartRateApi();
    } else if (!this.state.displayRated) {
      await this.setState({
        loading: true,
        paginateValue: num,
      });
      console.log('Стейт Всех обновился. Страница перелестнулась на ', num);
      return await this.getStartApi();
    }
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
    const apiRated = await this.movieService.getRatedMovieList(this.state.paginateValueRated).catch(this.getErrorMessage);
    if (apiRated == null) {
      return await this.setState({
        movieDataRated: [],
        loading: false,
        totalPages: 0,
      });
    } else {
      const totalPagesRated = await apiRated.total_pages;
      const movieDataRated = await apiRated.results.map(movie => {
        return {
          id: movie.id,
          title: movie.original_title,
          score: movie.vote_average.toFixed(1),
          data: this.getCurDate(movie.release_date),
          description: this.cutDescription(movie.overview, 90),
          rating: movie.rating,
          image: this.getCurImg(movie.poster_path),
          genres: movie.genre_ids,
        };
      });
      return await this.setState({
        movieDataRated: movieDataRated,
        loading: false,
        totalPages: totalPagesRated,
      });
    }
  };

  // изменение таблиста
  handleTabChange = async label => {
    // await this.getStartRateApi();
    await this.setState({
      loading: true,
    });

    if (label === 'Rated') {
      await this.setState({
        displayRated: true,
        paginateValueRated: 1,
      });
      await this.getStartRateApi();
    }

    if (label === 'Search') {
      await this.setState({
        displayRated: false,
      });
      console.log(this.state.paginateValue)
      await this.getStartApi();
    }
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

    // const apiRated = await this.movieService.getRatedMovieList().catch(this.getErrorMessage);
    // if (apiRated) {
    //   const movieDataRated = apiRated.results.map(movie => {
    //     return {
    //       id: movie.id,
    //       title: movie.original_title,
    //       score: movie.vote_average.toFixed(1),
    //       data: this.getCurDate(movie.release_date),
    //       description: this.cutDescription(movie.overview, 90),
    //       rating: movie.rating,
    //       image: this.getCurImg(movie.poster_path),
    //     };
    //   });

    //   this.setState({
    //     movieDataRated: movieDataRated,
    //     loading: false,
    //   });
    // }
    this.getStartApi().catch(this.getErrorMessage); //стартовый рендер фильмов на странице
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchName !== prevState.searchName) {
      this.getStartApi();
    }
  }
  sendRating = async (rating, id) => {
    localStorage.setItem(`${id}`, rating);
    if (rating == 0) {
      return this.movieService.deleteRaiting(id);
    } else {
      return this.movieService.getRating(rating, id);
    }
  };

  render() {
    const { paginateValueRated, moviesData, loading, error, paginateValue, totalPages, movieDataRated, displayRated, genres } = this.state;
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
              paginateValue={paginateValue}
              totalPages={totalPages}
              changeNumberPage={this.changeNumberPage}
              senRatingId={this.sendRating}
              genres={genres}
              paginateValueRated={paginateValueRated}
            />
          </main>
        </Online>
      </>
    );
  }
}
