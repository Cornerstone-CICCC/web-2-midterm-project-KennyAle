const search = document.querySelector('#search')
const form = document.querySelector('form')
const searchBtn = document.querySelector('.search-btn')

const apiKey = 'api_key=daf788f2ab38afabc8b5ea0ee12373da'

document.addEventListener('DOMContentLoaded', () => {
    contentGenerator()
})
// -------------Generating Content-------------
function contentGenerator() {
    getGenres()
    getTrendingMovies()
    getPlayingMovies()
    getRatedMovies()
    getUpcomingMovies()
    getPopularMovies()
}

// -------------Generating Banner Start-------------
const getPopularMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/popular?${apiKey}&language=en-US'`)
    let data = await response.json()
    console.log(data)
    createBanner(data)
}

function createBanner(data) {
    const heroBanner = document.querySelector('.herobanner')
    heroBanner.innerHTML = `
        <article class="heroleft">
            <h2>${data.results[0].title}</h2>
            <img class="poster" src="https://image.tmdb.org/t/p/w1280/${data.results[0].poster_path}" alt="">
            <a href="#">
                <img src="https://placehold.co/40x40" alt="">
                See More
            </a>
            </article>
            <article class="heroright">
            <h2>${data.results[1].title}</h2>
            <img class="poster" src="https://image.tmdb.org/t/p/w1280/${data.results[1].poster_path}" alt="">
            <a href="#">
                <img src="https://placehold.co/40x40" alt="">
                See More
            </a>
        </article>
    `

}
// -------------Generating Banner End-------------

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

// -------------Generating Genres Cards Start-------------
const getGenres = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
    let data = await response.json()
    createGenreCards(data)
}

function createGenreCards(genres) {
    const genresContainer = document.querySelector('.genres')
    genres.genres.forEach(genre => {
        let genreContainer = document.createElement('div')
        genreContainer.classList.add('genre')
        genreContainer.innerHTML = `<p>${genre.name}</p>`
        genresContainer.append(genreContainer)
        fetch(`./img/${genre.name}.svg`)
            .then(res => res.ok && res.text())
            .then(svg => {
                genreContainer.innerHTML += svg || 'Error'
            })

    })
    const genreWidth = document.querySelector('.genre').offsetWidth

    document.querySelector('.prev').addEventListener('click', () => {
        const currentScroll = genresContainer.scrollLeft

        if (currentScroll <= genreWidth) {
            genresContainer.scrollLeft = genresContainer.scrollWidth - genresContainer.clientWidth
        } else {
            genresContainer.scrollBy({ left: -genreWidth, behavior: 'smooth' })
        }
    })

    document.querySelector('.next').addEventListener('click', () => {
        const currentScroll = genresContainer.scrollLeft
        const maxScrollLeft = genresContainer.scrollWidth - genresContainer.clientWidth
        if (currentScroll + genreWidth >= maxScrollLeft) {
            genresContainer.scrollLeft = 0
        } else {
            genresContainer.scrollBy({ left: genreWidth, behavior: 'smooth' })
        }
    })

    function autoScroll() {
        const currentScroll = genresContainer.scrollLeft;
        const maxScrollLeft = genresContainer.scrollWidth - genresContainer.clientWidth

        if (currentScroll + genreWidth >= maxScrollLeft) {
            genresContainer.scrollLeft = 0
        } else {
            genresContainer.scrollBy({ left: genreWidth, behavior: 'smooth' })
        }
    }

    setInterval(() => {
        autoScroll()
    }, 2000)
}

// getGenres()
// -------------Generating Genres Cards End-------------
// -------------Generating Cards By Search Term Start-------------
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = search.value.trim().split(' ').join('+')
    if (query) {
        window.location.href = `results.html?query=${query}`
    }
})
// getSearchingMovies(search.value)

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

// getTrendingMovies()

function createCards(data, container) {
    let section = document.querySelector(`.${container}`)
    section.innerHTML = ''
    data.results.forEach(movie => {
        if (movie.title && movie.poster_path) {
            let movieFigure = document.createElement('figure')
            movieFigure.classList.add('card')
            movieFigure.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="">
                <figcaption>${movie.title}</figcaption>
                <div class="stats">
                    <span class="stars">
                        <p>&#11088;</p>
                        <p>${movie.vote_average}</p>
                    </span>
                    <p>${movie.release_date}</p>
                </div>
            `
            section.append(movieFigure)
            createModal(movie, movieFigure)
        }
    })
}

// -------------Generating Playing Cards Start-------------
const getPlayingMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'playing')
}

// getPlayingMovies()
// -------------Generating Playing Cards End-------------
// -------------Generating Rated Cards Start-------------
const getRatedMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'rated')
}

// getRatedMovies()
// -------------Generating Rated Cards End-------------
// -------------Generating Rated Cards Start-------------
const getUpcomingMovies = async () => {
    let response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'upcoming')
}

// getUpcomingMovies()
// -------------Generating Rated Cards End-------------

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
    console.log(data)
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
    console.log(movie);
    
}
// -------------Generating Movie Info End-------------

// const getMoviesByGenre = async () => {
//     let response = await fetch(`https://api.themoviedb.org/3/discover/movie?${apiKey}&include_adult=false&language=en-US&sort_by=release_date.desc&page=1&with_genres=35,53,27
//         `)
//     let data = await response.json()
//     console.log(data)
// }