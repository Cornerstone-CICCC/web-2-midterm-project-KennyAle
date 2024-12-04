const search = document.querySelector('#search')
const form = document.querySelector('form')
const apiKey = 'api_key=daf788f2ab38afabc8b5ea0ee12373da'

form.addEventListener('submit', (e) => {
    e.preventDefault()
    getSearchingMovies(search.value)
})

const getSearchingMovies = async (term) => {
    let query = term.split(' ').join('-')
    let response = await fetch(`https://api.themoviedb.org/3/search/multi?${apiKey}&query=${query}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'results')
}


// -------------Generating Trending Cards-------------
const getTrendingMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?${apiKey}&language=en-US'`)
    let data = await response.json()
    console.log(data);

    createCards(data, 'trendingmovies')
}

function createCards(data, container) {
    let section = document.querySelector(`.${container}`)
    data.results.forEach(movie => {
        if (movie.title && movie.poster_path) {
            let movieFigure = document.createElement('figure')
            movieFigure.classList.add('card')
            movieFigure.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="">
        <figcaption>${movie.title}</figcaption>
        `
        section.append(movieFigure)

        // ------MOVIE INFO------
        getMovie(movie.id, section)
    })
}

getTrendingMovies()
// -------------Generating Movie Info-------------
function createMovieInfo(movie, container) {
    let infoContainer = document.createElement('article')
    infoContainer.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="">
    <figcaption>${movie.title}</figcaption>
    `
    // container.append(infoContainer)
    document.body.append(infoContainer)
}

const getMovie = async (movieId, container) => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?${apiKey}&language=en-US`)
    let data = await response.json()
    console.log(data)
    createMovieInfo(data, container)
}

getMovie(1241982)
// -------------Generating Trending Cards-------------

const getPlayingMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    console.log(data)
}

const getMoviesByGenre = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?${apiKey}&include_adult=false&language=en-US&sort_by=release_date.desc&page=1&with_genres=35,53,27
        `)
    let data = await response.json()
    console.log(data)
}

// -------------Generating Genres Cards-------------
const getGenres = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
    let data = await response.json()
    createGenreCards(data)
}

function createGenreCards(genres) {
    let section = document.querySelector('.genres')
    genres.genres.forEach(genre => {
        let genreContainer = document.createElement('div')
        genreContainer.classList.add('genre')
        genreContainer.innerHTML = `
        <img src="https://placehold.co/40x40" alt="">
        <p>${genre.name}</p>
        `
        section.append(genreContainer)
    })
}
getGenres()
// -------------Generating Genres Cards-------------