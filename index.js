const dataContainer = document.querySelector(".Get_data");
const aside = document.querySelector('.single_movie');
const searchInput = document.querySelector(".Search_input");
const searchBtn = document.querySelector(".Search_btn");

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
        getData();
    }
});

searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        searchForMovie(searchTerm);
    } else {
        getData();
    }
});

// Fetch data from the API and render shows
async function getData() {
    try {
        const res = await fetch('https://api.tvmaze.com/shows');
        const data = await res.json();
        renderData(data.slice(0, 40));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to render data
function renderData(data) {
    let elements = '';
    data.forEach(movie => {
        elements += `
            <div class="card_Movie" data-id="${movie.id}">
                <img class="card_img" style="background-image: linear-gradient(transparent 50%, #000), url(${movie.image.original});">
                <div class="Movie_Name">
                    ${movie.name}
                </div>
                <div class="Movie_genre">
                    ${movie.genres[0]}
                </div>
            </div>
        `;
    });

    dataContainer.innerHTML = elements;
    // Call the function to add click event listeners to cards
    showAside();
}

// Add click event listeners to all cards
function showAside() {
    const cards = document.querySelectorAll('.card_Movie');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            showSingleMovie(id);
        });
    });
}

// Function to show data for a single movie in aside
async function showSingleMovie(id) {
    try {
        const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const data = await res.json();
        displaySingleMovie(data);
    } catch (error) {
        console.error('Error fetching single movie data:', error);
    }
}

// Function to display data for a single movie in aside
function displaySingleMovie(movieData) {
    let genres = '';
    movieData.genres.forEach(gen => {
        genres += `<p>${gen}</p>`;
    });
    
    aside.innerHTML = `
        <i class="fa-solid fa-xmark close_icon"></i>
        <img src="${movieData.image.original}" class="col-12 side_bar_img">
     
        <div class="col-12 content_aside">
            <h1 class="col-12">Title</h1>
            <p>${movieData.name}</p>
        </div>
        <hr>
        <div class="col-12 content_aside">
            <h1 class="col-12">Genre</h1>
            <p>${genres}</p>
        </div>
        <hr>
        <div class="col-12 content_aside">
            <h1 class="col-12">Summary</h1>
            <p>${movieData.summary}</p>
        </div>
        <hr>
        <div class="col-12">
            <a href="${movieData.url}" target="_blank">More about the movie</a>
        </div>
    `;
    aside.classList.add("active_single");

    // Add click event listener to close button
    const closeIcon = document.querySelector(".close_icon");
    closeIcon.addEventListener('click', () => {
        aside.classList.remove("active_single");
        console.log("closed");
    });
}

// Function to search for a movie
async function searchForMovie(value) {
    try {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${value}`);
        const data = await res.json();
        const shows = data.map(result => result.show);
        renderData(shows);
    } catch (error) {
        console.error('Error fetching searched data:', error);
    }
}

// Call the function to get and render shows
getData();





