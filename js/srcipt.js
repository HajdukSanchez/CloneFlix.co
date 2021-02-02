// Developed by Jozek Andrzej Hajduk Sánchez}
// Function when the page is loaded
(async function load() {
  // Remove local storage content
  window.localStorage.clear();
  // List of genders
  const GENDERS = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 'sci-fi', 'short-film', 'sport', 'superhero', 'thriller', 'war', 'western'];
  // Link for all the movies
  const API_GENDERS_URL = 'https://yts.mx/api/v2/list_movies.json?limit=50&genre=';
  // Link for movie suggestion
  const API_MOVIE_SUGGESTION = 'https://yts.mx/api/v2/movie_suggestions.json?movie_id=';
  // Movies lists container
  const $movies_list_container = document.getElementById('movies-list');
  // Loading Gif
  const $loading = document.getElementById('loading');
  // Principal movie
  const $main_movie_container = document.getElementById('main-movie');
  // Menu button
  const $menu = document.getElementById('menu');
  // Modal menu
  const $modal_menu = document.getElementById('modal-menu');


  // Funtion to get data for the API
  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // Cache saved on localStorage
  async function cacheExist(category) {
    const cahceList = window.localStorage.getItem(category + '_list')
    if (cahceList) {
      return JSON.parse(cahceList);
    } else {
      const {data:{movies: data}} = await getData(`${API_GENDERS_URL}${category}`);
      localStorage.setItem(`${category}_list`, JSON.stringify(data));
      return data;
    }
  }
  // HTML Templates
  function listTemplate(category) {
    return (
      `<div class="movies">
        <h1 class="movies__gender-title">${category[0].toUpperCase() + category.slice(1)}</h1>
        <div class="movies__container" id=${category}>
          <!-- Movies here -->
        </div>
      </div>`
    );
  }
  function movieTemplate(movie, category) {
    return (
      `<figure class="movie" data-id=${movie.id} data-category=${category}>
        <img src="${movie.large_cover_image}" alt="Movie">
        <div class="overlay movie__info">
          <button class="btn--info" title="Movie information">
            <img src="/assets/icon_movie__info.png" alt="Information about the movie">
          </button>
          <h4>${movie.title_english}</h4>
        </div>
      </figure>`
    );
  }
  function principalMovieTemplate(movie) {
    return (
      `<figure class="top-movie__image">
        <img src="${movie.background_image}" alt="Released movie">
      </figure>
      <div class="top-movie__description overlay" data-id=${movie.id} data-category=${movie.genres[0]}>
        <h1 class="top-movie__title">${movie.title_english}</h1>
        <p class="top-movie__info">${movie.synopsis}</p>
        <button class="btn btn--watch" type="submit">Watch Now</button>
        <button class="btn btn--info" type="submit">Add to Watchlist</button>
      </div>`
    );
  }
  // Render the movies for the genders
  async function renderGendersList() {
    GENDERS.forEach( gender => {
      const HTMLGenderList = listTemplate(gender);
      // Add containers for the genders
      $movies_list_container.innerHTML += HTMLGenderList;
    });
    GENDERS.forEach( gender => {
      const $movie_container = document.getElementById(`${gender}`);
      async function renderMovies() {
        let list = await cacheExist(gender);
        list.forEach( movie => {
          const HTMLMovie = movieTemplate(movie, gender);
          // Movies added to the genders
          $movie_container.innerHTML += HTMLMovie;
        });
      }
      renderMovies();
    });
  }
  // Aleatory number start - end
  function aleatoryNumber(start, end) {
    return Math.floor(Math.random() * end) + start;
  }
  // Render the principal movie information
  async function renderPrincipalMovie() {
    // Aleatory number 1 - 10
    const {data:{movies: data}} = await getData(`${API_MOVIE_SUGGESTION}${aleatoryNumber(1, 1000)}`);
    const HTMLMainMovie = principalMovieTemplate(data[aleatoryNumber(0, data.length)]);
    $main_movie_container.innerHTML += HTMLMainMovie;
  }
  // For show modal
  $menu.addEventListener('click', () => {
    if ($modal_menu.classList.contains('hidden')) {
      $modal_menu.classList.remove('hidden');
    } else {
      $modal_menu.classList.add('hidden');
    }
  })

  renderPrincipalMovie();
  await renderGendersList();
  setTimeout(() => {
    // Hide loading gif and show movies
    $loading.classList.add('hidden');
    $movies_list_container.classList.remove('hidden');
  }, 3000);
})()