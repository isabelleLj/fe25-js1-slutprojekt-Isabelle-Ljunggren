import {
  getData,
  getPopularMovies,
  searchMovie,
  searchPerson,
} from "./data.js";
import { createMovieCard, createPersonCards } from "./display.js";
// -------------------- Globala variabler --------------------
// DOM-element
const searchInput = document.getElementById("searchInput");
const searchContainer = document.getElementById("search-result-container");
const topRatedContainer = document.getElementById("top-rated-container");
const popularContainer = document.getElementById("popular-container");
const errorElement = document.getElementById("search-error");
let searchType = "movie";

// Initiera Top Rated och Popular
async function init() {
  const topRated = await getData();
  if (topRated) createMovieCard(topRated, "top-rated-container");

  const popular = await getPopularMovies();
  if (popular) createMovieCard(popular, "popular-container");
}
init();

// Sökfunktion med felmeddelanden
async function performSearch() {
  const query = searchInput.value.trim();
  errorElement.textContent = "";

  if (!query) return;

  try {
    if (searchType === "movie") {
      const data = await searchMovie(query);

      if (!data || data.length === 0) {
        errorElement.textContent = `No movies found for "${query}".`;
        searchContainer.innerHTML = "";
        return;
      }

      createMovieCard(data, "search-result-container");
    } else if (searchType === "person") {
      const data = await searchPerson(query);

      if (!data || data.length === 0) {
        errorElement.textContent = `No persons found for "${query}".`;
        searchContainer.innerHTML = "";
        return;
      }

      createPersonCards(data, "search-result-container");
    }
  } catch (error) {
    console.error(error);
    errorElement.textContent = "Check your spelling";
    searchContainer.innerHTML = "";
  }
}

// Event listeners
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performSearch();
  }
});

document.getElementById("searchMovieBtn").addEventListener("click", () => {
  searchType = "movie";
  performSearch();
});

document.getElementById("searchPersonBtn").addEventListener("click", () => {
  searchType = "person";
  performSearch();
});

anime({
  targets: "#header-title",
  translateY: [-50, 0],
  opacity: [0, 1],
  duration: 1200,
  easing: "easeOutExpo",
});
