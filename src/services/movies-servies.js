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

  async getResource(searchName, page) {
    const res = await fetch(
      `${this._url}/search/movie?query=${searchName}&include_adult=false&language=en-US&page=${page}&${this._apiKey}`,
      this._options,
    );
    if (!res.ok) {
      console.log(res.err);
      throw new Error(
        `Ошибочка< что-то не так с ${this._url}` + `код ошибки: ${res.status}`,
      );
    }

    const body = await res.json();
    console.log(body);
    return body;
  }
}
