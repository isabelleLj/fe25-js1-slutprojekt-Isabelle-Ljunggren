// Bearer key för TMDB API
const bearerKey = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWNmODYxYmJkYjMwNWE4NWUzNDhkZjk5NTU1NDY0MyIsIm5iZiI6MTc2NTgwNTM5MS4xNjcsInN1YiI6IjY5NDAwZDRmNzAxZWNiMDA1OGY3OGQzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6VMjQ2WP9XIEwIjpY6bEucL4iFvyaPpcZ68q3-k9nvA' }
  
};

// Fetch: Top Rated
export async function getData() {
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
export async function getPopularMovies() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', bearerKey);
    
     if (response.status === 404) {
       throw new Error('NOT FOUND');
     }
    
    if (!response.ok) throw 'NETWORK ERROR, TRY AGAIN';

    const data = await response.json();
    return data.results;

  } 
   catch (error) {
    console.error(error);
    errorElement.textContent = 'NETWORK ERROR, TRY AGAIN';
  }
}

// Fetch: Sök film
export async function searchMovie(query) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`, bearerKey);
    if (response.status === 404) {
       throw new Error('NOT FOUND');
    }

    if(!response.ok) {
      throw new Error('NETWORK ERROR')
    }
    const data = await response.json();
    return data.results;
 }
 catch (error) {
    console.error(error);
    throw new Error;
  }
}

// Fetch: Sök person
export async function searchPerson(query) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&language=en-US&page=1`, bearerKey);
    
     if (response.status === 404) {
       throw new Error('NOT FOUND');
    }
    
    if (!response.ok) throw 'Check your spelling';
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw error;
  }
}




