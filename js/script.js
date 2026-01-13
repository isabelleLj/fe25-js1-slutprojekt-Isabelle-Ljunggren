//G-nivå
// Användare ska minst kunna
// Välja att se en lista med de tio högst rankade filmerna. (Top rated)
// Välja att se en lista med de tio mest populära filmerna just nu. (Popular)
// Söka på en person med fri text. 
// Söka på en film med fri text. 

// GUI:t ska innehålla följande
// Top-10-listor med filmer ska visa 10 stycken där varje film ska ha
// Bild
// Titel
// Release date
// Sökresultat för film ska visa lika många filmer som finns i resultatet.  (Det räcker med page 1) För varje film ska följande visas
// Bild
// Titel
// Release date
// Beskrivning
// Sökresultat för personer ska visa lika många personer som finns i resultatet. (Det räcker med Page 1) För varje person ska följande visas:
// Bild
// Namn
// Avdelning hen är känd för (Acting / directing / editing mm)
// Lista med 3 TV och filmer som hen är mest känd för. Det ska tydligt visas vad som är en film och vad som är en tv-serie.  Ex:
// Movie: titel
// TV: titel
// TV: titel
// Error-meddelande ska visa minst följande
// Om användaren kan göra någonting åt felet ska användaren bli meddelad om detta. Tex om sökningen inte ger något resultat.
// Vid alla andra error räcker det med att användaren får veta att något gått fel. Tex vid server-  eller nätverksfel.


// -------------------- Globala variabler --------------------
// DOM-element
const searchInput = document.getElementById('searchInput');
const searchContainer = document.getElementById('search-result-container');
const topRatedContainer = document.getElementById('top-rated-container');
const popularContainer = document.getElementById('popular-container');
const errorElement = document.getElementById('search-error');
let searchType = 'movie';

// Bearer key för TMDB API
const bearerKey = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWNmODYxYmJkYjMwNWE4NWUzNDhkZjk5NTU1NDY0MyIsIm5iZiI6MTc2NTgwNTM5MS4xNjcsInN1YiI6IjY5NDAwZDRmNzAxZWNiMDA1OGY3OGQzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6VMjQ2WP9XIEwIjpY6bEucL4iFvyaPpcZ68q3-k9nvA' }
  
};



// Helper: skapa poster-URL
function movieURL(movie) {
  return `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
}

// Skapa filmkort
function createMovieCard(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const movieWrapper = document.createElement('div');
  movieWrapper.classList.add('movie-wrapper');

  const movies = data.slice(0, 10);

  for (const movie of movies) {
    const card = document.createElement('div');
    card.classList.add('topRated-card');

    const image = document.createElement('img');
    image.src = movieURL(movie);

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const releaseDate = document.createElement('p');
    releaseDate.textContent = movie.release_date;

    const description = document.createElement('p');
    description.textContent = movie.overview;

    const rating = document.createElement('p');
    rating.textContent = `⭐ ${movie.vote_average.toFixed(1)} / 10`;

    card.append(image, title, releaseDate, description, rating);
    movieWrapper.appendChild(card);
  }

  container.appendChild(movieWrapper);
}

// Skapa personkort
function createPersonCards(data) {
  searchContainer.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.classList.add('movie-wrapper');

  data.forEach(person => {
    const card = document.createElement('div');
    card.classList.add('topRated-card');

    const name = document.createElement('h3');
    name.textContent = person.name;
    card.appendChild(name);

    if (person.profile_path) {
      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w342${person.profile_path}`;
      card.appendChild(img);
    }

    const dept = document.createElement('p');
    dept.textContent = `Known for: ${person.known_for_department}`;
    card.appendChild(dept);

    if (person.known_for && person.known_for.length > 0) {
      const ul = document.createElement('ul');
      person.known_for.slice(0,3).forEach(item => {
        const li = document.createElement('li');
        const type = item.media_type === 'movie' ? 'Movie' : 'TV';
        li.textContent = `${type}: ${item.title || item.name}`;
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    wrapper.appendChild(card);
  });

  searchContainer.appendChild(wrapper);
}

// Fetch: Top Rated
async function getData() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', bearerKey);
    if (!response.ok) throw 'NETWORK ERROR, TRY AGAIN';
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    errorElement.textContent = 'NETWORK ERROR; TRY AGAIN';
  }
}

// Fetch: Most Popular
async function getPopularMovies() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', bearerKey);
    if (!response.ok) throw 'NETWORK ERROR, TRY AGAIN';
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    errorElement.textContent = 'NETWORK ERROR, TRY AGAIN';
  }
}

// Fetch: Sök film
async function searchMovie(query) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`, bearerKey);
    if (!response.ok) throw 'Check your spelling';
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Fetch: Sök person
async function searchPerson(query) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&language=en-US&page=1`, bearerKey);
    if (!response.ok) throw 'Check your spelling';
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Initiera Top Rated och Popular
async function init() {
  const topRated = await getData();
  if (topRated) createMovieCard(topRated, 'top-rated-container');

  const popular = await getPopularMovies();
  if (popular) createMovieCard(popular, 'popular-container');
}
init();

// Sökfunktion med felmeddelanden
async function performSearch() {
  const query = searchInput.value.trim();
  errorElement.textContent = '';

  if (!query) return;

  try {
    if (searchType === 'movie') {
      const data = await searchMovie(query);
      if (!data || data.length === 0) {
        errorElement.textContent = `No movies found for "${query}".`;
        searchContainer.innerHTML = '';
        return;
      }
      createMovieCard(data, 'search-result-container');

    } else if (searchType === 'person') {
      const data = await searchPerson(query);
      if (!data || data.length === 0) {
        errorElement.textContent = `No persons found for "${query}".`;
        searchContainer.innerHTML = '';
        return;
      }
      createPersonCards(data);
    }
  } catch (error) {
    console.error(error);
    errorElement.textContent = 'Check your spelling';
    searchContainer.innerHTML = '';
  }
}

// Event listeners
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performSearch();
  }
});

document.getElementById('searchMovieBtn').addEventListener('click', () => {
  searchType = 'movie';
  performSearch();
});

document.getElementById('searchPersonBtn').addEventListener('click', () => {
  searchType = 'person';
  performSearch();
});










// const movies = document.getElementById('container');









// const bearerKey = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWNmODYxYmJkYjMwNWE4NWUzNDhkZjk5NTU1NDY0MyIsIm5iZiI6MTc2NTgwNTM5MS4xNjcsInN1YiI6IjY5NDAwZDRmNzAxZWNiMDA1OGY3OGQzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6VMjQ2WP9XIEwIjpY6bEucL4iFvyaPpcZ68q3-k9nvA'
//   }
// };









// async function getData(){
//   try{
//     const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, bearerKey);
//     // console.log(response)
//     // const movies = response.result;

//     if(response.ok){
//       const value = await response.json();
//       return value.results;
//     }
//     else{
//       throw 'Something went wrong'
//     }
   
//   }
//    catch(error){
//       throw error;
//     }
// }



//   function movieURL(movie){
//     const poster_path = movie.poster_path;
//     return `https://image.tmdb.org/t/p/w342${poster_path}`;

//   }


  

//   function createMovieCard(data){
//     const movieCard = document.createElement ('div');
//     movieCard.classList.add('movie-wrapper');

    


//     const movies = data;
//     const splicedMovies = movies.slice(0, 10);
//     const div = document.getElementById('container');
//     div.innerHTML= '';

//     for (const movie of splicedMovies){
//         console.log(movie);
        

       

//         const movieImage = document.createElement('img');
//         movieImage.src = movieURL (movie);
//         const card = document.createElement ('div');
//         card.classList.add('topRated-card');
//         card.classList.add('p-2', 'w-100');

//         const title = document.createElement('h3');
//         const  releaseDate = document.createElement('p');
//         const description = document.createElement('p');

//         title.innerHTML = movie.title;
//         releaseDate.innerHTML = movie.release_date;
//         description.innerHTML = movie.overview;

//         const rating = document.createElement('p');
//         rating.textContent = `⭐ ${movie.vote_average.toFixed(1)} / 10`;




//         card.appendChild(movieImage);
//         card.appendChild(title);
//         card.appendChild(releaseDate);
//         card.appendChild(description);
//         card.appendChild(rating);




//         movieCard.appendChild(card);
//         div.appendChild(movieCard);


//     }
    
// }

//   getData()
//    .then(data => {
//     createMovieCard(data);
//   })
//   .catch(error=>console.log(error))




// async function getPopularMovies() {
//   try {
//     const response = await fetch(
//       'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
//       bearerKey
//     );

//     if (!response.ok) {
//       throw 'Something went wrong';
//     }

//     const data = await response.json();
//     return data.results;

//   } catch (error) {
//     console.log(error);
//   }
// }

// function createMovieCard(data, containerId) {
//   const container = document.getElementById(containerId);
//   container.innerHTML = '';

//   const movieWrapper = document.createElement('div');
//   movieWrapper.classList.add('movie-wrapper');

//   const movies = data.slice(0, 10);

//   for (const movie of movies) {

//     const card = document.createElement('div');
//     card.classList.add('topRated-card');

//     const image = document.createElement('img');
//     image.src = movieURL(movie);

//     const title = document.createElement('h3');
//     title.textContent = movie.title;

//     const releaseDate = document.createElement('p');
//     releaseDate.textContent = movie.release_date;

//     const description = document.createElement('p');
//     description.textContent = movie.overview;

//     const rating = document.createElement('p');
//     rating.textContent = `⭐ ${movie.vote_average.toFixed(1)} / 10`;


//     card.appendChild(image);
//     card.appendChild(title);
//     card.appendChild(releaseDate);
//     card.appendChild(description);
//     card.appendChild(rating);


//     movieWrapper.appendChild(card);
//   }

//   container.appendChild(movieWrapper);
// }

// getData().then(data => {
//   createMovieCard(data, 'top-rated-container');
// });

// getPopularMovies().then(data => {
//   createMovieCard(data, 'popular-container');
// });


// /*Personsök*/

// const searchInput = document.getElementById('searchInput');
// let searchType = 'movie'; // default search type

// // Funktioner för API
// async function searchMovie(query) {
//   const response = await fetch(
//     `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
//     bearerKey
//   );
//   const data = await response.json();
//   return data.results;
// }

// async function searchPerson(query) {
//   const response = await fetch(
//     `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&language=en-US&page=1`,
//     bearerKey
//   );
//   const data = await response.json();
//   return data.results;
// }





// // Skapa kort för film
// function createMovieCard(data, containerId) {
//   const container = document.getElementById(containerId);
//   container.innerHTML = '';
//   const wrapper = document.createElement('div');
//   wrapper.classList.add('movie-wrapper');
//   const movies = data.slice(0, 10);
//   movies.forEach(movie => {
//     const card = document.createElement('div');
//     card.classList.add('topRated-card');

//     const image = document.createElement('img');
//     image.src = movieURL(movie);
//     const title = document.createElement('h3');
//     title.textContent = movie.title;
//     const releaseDate = document.createElement('p');
//     releaseDate.textContent = movie.release_date;
//     const description = document.createElement('p');
//     description.textContent = movie.overview;
//     const rating = document.createElement('p');
//     rating.textContent = `⭐ ${movie.vote_average.toFixed(1)} / 10`;

//     card.append(image, title, releaseDate, description, rating);
//     wrapper.appendChild(card);
//   });
//   container.appendChild(wrapper);
// }

// // Skapa kort för person
// function createPersonCards(data) {
//   const container = document.getElementById('search-result-container');
//   container.innerHTML = '';
//   const wrapper = document.createElement('div');
//   wrapper.classList.add('movie-wrapper');
//   const people = data.slice(0, 10);
//   people.forEach(person => {
//     const card = document.createElement('div');
//     card.classList.add('topRated-card');

//     const name = document.createElement('h3');
//     name.textContent = person.name;
//     card.appendChild(name);

//     if (person.profile_path) {
//       const img = document.createElement('img');
//       img.src = `https://image.tmdb.org/t/p/w342${person.profile_path}`;
//       card.appendChild(img);
//     }

//     const knownFor = document.createElement('p');
//     knownFor.textContent = `Known for: ${person.known_for_department}`;
//     card.appendChild(knownFor);

//     wrapper.appendChild(card);
//   });
//   container.appendChild(wrapper);
// }

// // Enter fungerar
// searchInput.addEventListener('keydown', async (event) => {
//   if (event.key === 'Enter') {
//     const query = searchInput.value.trim();
//     if (!query) return;

//     if (searchType === 'person') {
//       const data = await searchPerson(query);
//       createPersonCards(data);
//     } else {
//       const data = await searchMovie(query);
//       createMovieCard(data, 'search-result-container');
//     }
//   }
// });

// // Knappklick
// document.getElementById('searchMovieBtn').addEventListener('click', async () => {
//   searchType = 'movie';
//   const query = searchInput.value.trim();
//   if (!query) return;
//   const data = await searchMovie(query);
//   createMovieCard(data, 'search-result-container');
// });

// document.getElementById('searchPersonBtn').addEventListener('click', async () => {
//   searchType = 'person';
//   const query = searchInput.value.trim();
//   if (!query) return;
//   const data = await searchPerson(query);
//   createPersonCards(data);
// });



















 














