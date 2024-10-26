export default class movieServiceApi {
  _options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTcyNjA1OWM2NTFmZjRlYzdmODAyMmY2NTUyMWZiYSIsIm5iZiI6MTcyOTQzMzg5NS4yMTIwODYsInN1YiI6IjY3MTUwZWU0YzZlMzA0MDk2MTk2NDkwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n11zOBzj1JoAGaRdBhU6kHK8TU98lI4WvWe0V0LQhDU',
    },
  };

  _url = 'https://api.themoviedb.org/3';
  _apiKey = 'api_key=b9726059c651ff4ec7f8022f65521fba';
  // получение фильмов по название и странице
  async getResource(searchName, page) {
    const res = await fetch(
      `${this._url}/search/movie?query=${searchName}&include_adult=false&language=en-US&page=${page}&${this._apiKey}`,
      this._options,
    );
    if (!res.ok) {
      console.log(res.err);
      throw new Error(`Ошибочка< что-то не так с ${this._url}` + `код ошибки: ${res.status}`);
    }

    const body = await res.json();
    console.log(body);
    return body;
  }
  //Создание гостевого сеанса
  createGuestSession = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTcyNjA1OWM2NTFmZjRlYzdmODAyMmY2NTUyMWZiYSIsIm5iZiI6MTcyOTg2MzI5My40MTAyNDcsInN1YiI6IjY3MTUwZWU0YzZlMzA0MDk2MTk2NDkwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SVl6ku5AdnKUPVSJGlUi01AyHJjzVFoQtZZGPgI-FDA',
      },
    };

    return await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options)
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('timeGuestSession', res.expires_at);
        console.log(`timeGuestSession обновилась на ${res.expires_at}`);
        console.log(res.guest_session_id);
        localStorage.setItem('guestSessionId', res.guest_session_id);
        console.log(`guestSessionId обновилась на ${res.guest_session_id}`);
      })
      .catch(err => console.error(err));
  };

  // получение фильмов
  getRatedMovieList = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTcyNjA1OWM2NTFmZjRlYzdmODAyMmY2NTUyMWZiYSIsIm5iZiI6MTcyOTg2MzI5My40MTAyNDcsInN1YiI6IjY3MTUwZWU0YzZlMzA0MDk2MTk2NDkwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SVl6ku5AdnKUPVSJGlUi01AyHJjzVFoQtZZGPgI-FDA',
      },
    };
    // console.log(localStorage.getItem('guestSessionId'));
    const result = await fetch(
      `${this._url}/guest_session/${localStorage.getItem('guestSessionId')}/rated/movies?${this._apiKey}&page=1`,
      options,
    );
    if (result.ok) {
      return result.json();
    } else {
      return null;
    }
  };

  //отправка рейтинга
  sendRating = async (rating, id) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTcyNjA1OWM2NTFmZjRlYzdmODAyMmY2NTUyMWZiYSIsIm5iZiI6MTcyOTg2MzI5My40MTAyNDcsInN1YiI6IjY3MTUwZWU0YzZlMzA0MDk2MTk2NDkwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SVl6ku5AdnKUPVSJGlUi01AyHJjzVFoQtZZGPgI-FDA',
      },
      body: JSON.stringify({
        value: rating,
      }),
    };
    fetch(
      `${this._url}/movie/${id}/rating?${this._apiKey}&guest_session_id=${localStorage.getItem('guestSessionId')}`,
      options,
    )
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.error(err));
  };
}
