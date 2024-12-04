const search = document.querySelector('#search')
const form = document.querySelector('form')
const apiKey = 'api_key=daf788f2ab38afabc8b5ea0ee12373da'

const genresContainer = document.querySelector('.genres')
const genreWidth = document.querySelector('.genre').offsetWidth
document.querySelector('.prev').addEventListener('click', () => {
    genresContainer.scrollBy({ left: -genreWidth, behavior: 'smooth' })
})
document.querySelector('.next').addEventListener('click', () => {
    genresContainer.scrollBy({ left: genreWidth, behavior: 'smooth' })
})

// -------------Generating Cards By Search Term Start-------------
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
// -------------Generating Cards By Search Term End-------------

// -------------Generating Trending Cards Start-------------
const getTrendingMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?${apiKey}&language=en-US'`)
    let data = await response.json()
    createCards(data, 'trendingmovies')
}

getTrendingMovies()

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
            createModal(movie, movieFigure)
        }
    })
}
// -------------Generating Trending Cards End-------------

// -------------Generating Movie Info Start-------------
function createModal(movie, container) {
    const modal = document.querySelector('.modal')
    const modalContent = document.querySelector('.modal-content')
    
    container.onclick = () => {
        modal.style.display = 'block'
        getMovie(movie.id, modalContent)
    }
}

const getMovie = async (movieId, container) => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?${apiKey}&language=en-US`)
    let data = await response.json()
    createMovieInfo(data, container)
}

function createMovieInfo(movie, container) {
    container.innerHTML += `
    <span class="close">&times;</span>
    <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="">
    <figcaption>${movie.title}</figcaption>
    `
    const modal = document.querySelector('.modal')
    const closeBtn = document.querySelector('.close')
    closeBtn.onclick = () => {
        modal.style.display = 'none'
        container.innerHTML = ''
    }
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = 'none'
            container.innerHTML = ''
        }
    }
}
// -------------Generating Movie Info End-------------

// const getPlayingMovies = async () => {
//     let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${apiKey}&include_adult=false&language=en-US&page=1`)
//     let data = await response.json()
//     console.log(data)
// }

// const getMoviesByGenre = async () => {
//     let response = await fetch(`https://api.themoviedb.org/3/discover/movie?${apiKey}&include_adult=false&language=en-US&sort_by=release_date.desc&page=1&with_genres=35,53,27
//         `)
//     let data = await response.json()
//     console.log(data)
// }

// -------------Generating Genres Cards Start-------------
// const getGenres = async () => {
//     let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
//     let data = await response.json()
//     createGenreCards(data)
// }

// function createGenreCards(genres) {
//     let section = document.querySelector('.genres')
//     genres.genres.forEach(genre => {
//         let genreContainer = document.createElement('div')
//         genreContainer.classList.add('genre')
//         genreContainer.innerHTML = `
//         <img src="https://placehold.co/40x40" alt="">
//         <p>${genre.name}</p>
//         `
//         section.append(genreContainer)
//     })
// }

// getGenres()
// -------------Generating Genres Cards End-------------