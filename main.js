const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("moviesContainer");
const popup = document.getElementById("popup");
const popupDetails = document.getElementById("popupDetails");
const closePopup = document.getElementById("closePopup");

// Replace with your own OMDb API key
const API_KEY = "e655b566";

// Search button click
btn.addEventListener("click", () => {
  const query = input.value.trim();
  if (query === "") return alert("Please enter a movie name");
  searchMovies(query);
});

// Press Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btn.click();
});

// Fetch movies
async function searchMovies(query) {
  moviesContainer.innerHTML = "<p style='color:white;'>Loading...</p>";
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "False") {
      moviesContainer.innerHTML = `<p style="color:#ff8080;">${data.Error}</p>`;
      return;
    }

    displayMovies(data.Search);
  } catch (error) {
    console.error(error);
    moviesContainer.innerHTML = `<p style="color:#ff8080;">Something went wrong</p>`;
  }
}

// Display movies
function displayMovies(movies) {
  moviesContainer.innerHTML = movies
    .map(movie => {
      return `
        <div class="movie-card" data-id="${movie.imdbID}">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"}" alt="${movie.Title}">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
        </div>
      `;
    })
    .join("");

  // Add click event to show details
  document.querySelectorAll(".movie-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      getMovieDetails(id);
    });
  });
}

// Fetch movie details
async function getMovieDetails(id) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
    const data = await response.json();

    popupDetails.innerHTML = `
      <img src="${data.Poster !== "N/A" ? data.Poster : "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"}" alt="${data.Title}">
      <h2>${data.Title} (${data.Year})</h2>
      <p><strong>Genre:</strong> ${data.Genre}</p>
      <p><strong>Actors:</strong> ${data.Actors}</p>
      <p><strong>Runtime:</strong> ${data.Runtime}</p>
      <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
      <p><strong>Plot:</strong> ${data.Plot}</p>
    `;

    popup.classList.remove("hidden");
  } catch (error) {
    console.error(error);
  }
}

// Close popup
closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});
