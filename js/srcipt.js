// Developed by Jozek Andrzej Hajduk Sánchez}

// List of genders
const GENDERS = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 'sci-fi', 'short-film', 'sport', 'superhero', 'thriller', 'war', 'western'];
// Link for all the movies
const API_GENDERS_URL = 'https://yts.mx/api/v2/list_movies.json?limit=50&genre=';
// Link for movie suggestion
const API_MOVIE_SUGGESTION = 'https://yts.mx/api/v2/movie_suggestions.json?movie_id=';
// Link movie search
const API_MOVIE_SEARCH = 'https://yts.mx/api/v2/list_movies.json?limit=!&query_term=';
// Movies lists container
const $movies_list_container = document.getElementById('movies-list');
// Principal movie
const $main_movie_container = document.getElementById('main-movie');
// Menu button
const $menu = document.getElementById('menu');
// Modal menu
const $modal_menu = document.getElementById('modal-menu');
// Toogle dark mode
const $toogle = document.getElementById('toogle');
// Body
const $body = document.getElementById('body');
// Featuring
const $featuring = document.getElementById('featuring');
// Form
const $form = document.getElementById('form');

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
    `<figure class="movie" data-id=${movie.id} data-category=${category} onclick="showModal(this.dataset.id, this.dataset.category)">
      <img src="${movie.large_cover_image}" alt="${movie.title} cover">
      <div class="overlay movie__info">
        <button class="btn--info" title="Movie information">
          <img src="./assets/icon_movie__info.png" alt="${movie.title} Information">
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
        <button class="btn btn--watch" type="submit" disabled>Watch Now</button>
        <button class="btn btn--info" type="submit" disabled>About it</button>
    </div>`
  );
}
function featuringMovieTemplate(movie) {
  return (
    `<div class="featuring__movie hidden" id="movie-search">
      <button class="featuring__button" id="button-featuring" onclick="hideModal()">
        <img src="./assets/icon_featuring--close.png" alt="Close button">
      </button>
      <div class="featuring__info">
        <figure class="featuring__image">
          <img src="${movie.large_cover_image}" alt="${movie.title} cover">
        </figure>
        <div class="featuring__info--basic">
          <h1 class="featuring__title">${movie.title_long}</h1>
          <h2 class="featuring__year">${movie.year}</h2>
          <h4 class="featuring__rating">${movie.rating}</h4>
          <h3 class="featuring__gender">${movie.genres[0]}</h3>
        </div>
      </div>
      <div class="featuring__info--full">
        <p class="featuring__description">
        ${movie.description_full}
        </p>
      </div>
    </div>`
  )
};
function loaderTempalte() {
  return (
    `<figure class="loading" id="loading">
      <img src="https://www.daevi.net/wp-content/plugins/bbpowerpack/assets/images/spinner.gif" alt="Loading Icon" class="loading__icon">
    </figure>`
  )
}

// Show featuring
function showFeaturing(movie) {
  $featuring.classList.remove('hidden');
  $featuring.innerHTML += loaderTempalte();
  const HTMLMovieSearch = featuringMovieTemplate(movie);
  if (HTMLMovieSearch) {
    setTimeout(() => {
      $featuring.innerHTML += HTMLMovieSearch;
    }, 1000);
  }
}

// Show modal
function showModal(id, category) {
  function findMovie(id, category) {
    const list = JSON.parse(window.localStorage.getItem(category + '_list'));
    return list.find( movie => movie.id === parseInt(id, 10));
  }
  const movie = findMovie(id, category);
  // If find the movie
  if (movie) {
    showFeaturing(movie);
  }
}

// Hide Modal
function hideModal() {
  // Remove the childrens inside modal featurig movie
  while ($featuring.hasChildNodes()) {
    $featuring.removeChild($featuring.firstChild);
  }
  $featuring.classList.add('hidden');
}

// For show modal
$menu.addEventListener('click', () => {
  if ($modal_menu.classList.contains('hidden')) {
    $modal_menu.classList.remove('hidden');
  } else {
    $modal_menu.classList.add('hidden');
  }
});

// Dark mode
$toogle.addEventListener('change', () => {
  $body.classList.toggle('dark');
});

// Function when the page is loaded
(async function load() {
  // Remove local storage content
  window.localStorage.clear();
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

  // Search input result
  $form.addEventListener('submit',async (event) => {
    event.preventDefault();
    const data = new FormData($form);
    try {
      const {data:{movies: movie}} = await getData(`${API_MOVIE_SEARCH}${data.get('movie-search')}`);
      console.log(movie);
      if (movie) {
        showFeaturing(movie[0]);
      }
    } catch (error) {
      alert('No result ...');
      $featuring.classList.add('hidden');
    }
  });

  console.log(getData(`${API_GENDERS_URL}${GENDERS[0]}`));

  // Hide main movie container
  $main_movie_container.classList.add('hidden');
  await renderPrincipalMovie();
  await renderGendersList();
  setTimeout(() => {
    $main_movie_container.classList.remove('hidden');
    $movies_list_container.classList.remove('hidden');
  }, 3000);
})()
