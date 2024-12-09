const BASE_URL = "https://api.themoviedb.org/3";
const searchResultsSection = document.querySelector('.search-results');
const searchTermSpan = document.getElementById('search-term');
const search = document.querySelector('#search')
const form = document.querySelector('form')
const searchBtn = document.querySelector('.search-btn')
const moviesBtn = document.querySelector('.movies-btn')
const seriesBtn = document.querySelector('.series-btn')
const aboutBtn = document.querySelector('.about-btn')
const main = document.querySelector('main')
const about = document.querySelector('.about')
const masonry = document.querySelector('.about-grid')
const toggle = document.querySelector('#dark-mode-toggle')
const apiKey = 'api_key=daf788f2ab38afabc8b5ea0ee12373da'

document.addEventListener('DOMContentLoaded', () => {
    const getTheme = localStorage.getItem('theme')
    if (getTheme == 'dark') {
        document.body.classList.add(getTheme + '-theme')
        if(getTheme == 'dark') {
            toggle.checked = true
        }
    } 
})

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme')
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark')
    } else {
        localStorage.setItem('theme', 'light')
    }
})

searchBtn.onclick = (e) => {
    e.stopPropagation()
    form.style.display = 'flex'
    search.focus()
}

document.onclick = (e) => {
    if (e.target !== searchBtn && e.target !== form && e.target !== search) {
        form.style.display = 'none'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = search.value.trim().split(' ').join('+')
    if (query) {
        window.location.href = `results.html?query=${query}`
    }
})

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

let currentPage = 1

if (query) {
    searchTermSpan.textContent = query.replace(/\+/g, ' ');
    loadSearchResults(query, currentPage);
} else {
    searchResultsSection.innerHTML = '<p>No results found.</p>';
}

let originalSearchResults = []
let activeFilter = 'all'
let isFetching = false

async function loadSearchResults(query, page) {
    try {
        const response = await fetch(`${BASE_URL}/search/multi?${apiKey}&query=${query}&include_adult=false&language=en&page=${page}`);
        const data = await response.json();
        originalSearchResults.push(...data.results)

        let filteredResults = data.results
        if (activeFilter === 'movies') {
            filteredResults = data.results.filter(result => result.media_type === 'movie')
        } else if (activeFilter === 'series') {
            filteredResults = data.results.filter(result => result.media_type === 'tv')
        }

        createSearchCards(filteredResults)
        isFetching = false
    } catch (error) {
        console.error('Error loading results:', error);
        isFetching = false
    }
}

function showLoading() {
    const loading = document.createElement('div')
    loading.className = 'loading'
    loading.textContent = 'Loading More Results...'
    searchResultsSection.append(loading)
}

function hideLoading() {
    const loading = document.querySelector('.loading')
    if (loading) loading.remove()
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetching) {
        showLoading()
        isFetching = true
        currentPage++
        loadSearchResults(query, currentPage).finally(hideLoading)
    }
})

const getPopularMovies = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/${type}/popular?${apiKey}&language=en-US'`)
    let data = await response.json()
    createAbout(data)
}

function createAbout(data) {
    let aboutContainer = document.createElement('div')
    aboutContainer.classList.add('about-container')
    aboutContainer.innerHTML = `
        <div class="about-text">
            <h1>About This Project</h1>
            <p>
                This application is designed to bring the world of movies and TV shows to your fingertips. Using the
                powerful TMDB API, we provide you with up-to-date information on your favorite titles, including
                cast, crew, ratings, and more.
            </p>
            <p>
                Below is a sample of movie posters displayed using a dynamic masonry grid. This feature will
                showcase trending movies fetched directly from TMDB.
            </p>
        </div>
    `
    let masonry = document.createElement('div')
    masonry.classList.add('about-grid')
    data.results.forEach((movie, index) => {
        if (index < 18) {
            let img = document.createElement('img')
            img.src = `https://image.tmdb.org/t/p/w1280/${movie.poster_path}"`
            img.alt = movie.title || movie.name || "Poster"
            img.title = movie.title || movie.name || "Poster"
            masonry.append(img)
        }
    })
    aboutContainer.append(masonry)
    about.append(aboutContainer)
}


function createSearchCards(results) {
    if (results.length === 0 && currentPage === 1) {
        searchResultsSection.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(result => {
        if ((result.media_type === 'movie' || result.media_type === 'tv') && result.poster_path) {
            const card = document.createElement('figure');
            card.classList.add('card');

            const title = result.title || result.name;
            const releaseDate = result.release_date || result.first_air_date || '';
            const mediaType = result.media_type === 'movie' ? 'Movie' : 'TV Show';

            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w185/${result.poster_path}" alt="${title}" title="${title} (${mediaType})">
                <figcaption>${title} (${mediaType})</figcaption>
                <div class="stats">
                    <span class="stars">
                        <p>&#11088;</p>
                        <p>${result.vote_average}</p>
                    </span>
                    <p>${releaseDate}</p>
                </div>
            `;
            searchResultsSection.append(card);
        }
    });
}

aboutBtn.onclick = () => {
    activeFilter = 'all'
    aboutBtn.classList.add('active')
    moviesBtn.classList.remove('active')
    seriesBtn.classList.remove('active')
    main.style.display = 'none'
    about.style.display = 'block'
    if (!aboutBtn.classList.contains('active')) {
        getPopularMovies('movie')
    }
}
getPopularMovies('movie')

moviesBtn.onclick = () => {
    if (moviesBtn.classList.contains('active')) {
        activeFilter = 'all'
        moviesBtn.classList.remove('active')
        searchResultsSection.innerHTML = ''
        createSearchCards(originalSearchResults)
    } else {
        activeFilter = 'movies'
        moviesBtn.classList.add('active')
        seriesBtn.classList.remove('active')
        aboutBtn.classList.remove('active')
        main.style.display = 'flex'
        about.style.display = 'none'
        const filteredResults = originalSearchResults.filter(result => result.media_type === 'movie')
        searchResultsSection.innerHTML = ''
        createSearchCards(filteredResults)
    }
}

seriesBtn.onclick = () => {
    if (seriesBtn.classList.contains('active')) {
        activeFilter = 'all'
        seriesBtn.classList.remove('active')
        searchResultsSection.innerHTML = ''
        createSearchCards(originalSearchResults)
    } else {
        activeFilter = 'series'
        seriesBtn.classList.add('active')
        moviesBtn.classList.remove('active')
        aboutBtn.classList.remove('active')
        main.style.display = 'flex'
        about.style.display = 'none'
        const filteredResults = originalSearchResults.filter(result => result.media_type === 'tv')
        searchResultsSection.innerHTML = ''
        createSearchCards(filteredResults)
    }
}
