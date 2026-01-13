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
export{movieURL, createMovieCard, createPersonCards}