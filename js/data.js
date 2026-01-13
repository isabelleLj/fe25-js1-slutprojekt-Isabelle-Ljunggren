// Bearer key för TMDB API
const bearerKey = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer DIN_API_KEY_HÄR'
  }
};

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


export{getData,getPopularMovies,searchMovie,searchPerson}