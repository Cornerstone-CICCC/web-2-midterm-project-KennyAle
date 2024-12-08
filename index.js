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
    contentGenerator('movie', 'movie/now_playing', 'movie/upcoming')
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

seriesBtn.onclick = () => {
    contentGenerator('tv', 'tv/airing_today', 'tv/on_the_air')
    seriesBtn.classList.add('active')
    aboutBtn.classList.remove('active')
    moviesBtn.classList.remove('active')
    main.style.display = 'flex'
    about.style.display = 'none'
    about.innerHTML = ''
}

moviesBtn.onclick = () => {
    contentGenerator('movie', 'movie/now_playing', 'movie/upcoming')
    seriesBtn.classList.remove('active')
    aboutBtn.classList.remove('active')
    moviesBtn.classList.add('active')
    main.style.display = 'flex'
    about.style.display = 'none'
    about.innerHTML = ''
}

aboutBtn.onclick = () => {
    aboutBtn.classList.add('active')
    moviesBtn.classList.remove('active')
    seriesBtn.classList.remove('active')
    main.style.display = 'none'
    about.style.display = 'block'
}

function createAbout(data) {
    let aboutContainer = document.createElement('div')
    aboutContainer.classList.add('about-container')
    aboutContainer.innerHTML = `
        <div class="about-text">
    <h1>About This Project</h1>
    <p>
        Welcome to the ultimate movie and TV show hub! This application brings a curated selection of popular and trending titles directly from TMDB (The Movie Database). With a user-friendly interface, you can easily explore films and shows, see the latest ratings, view cast and crew information, and even watch trailers.
    </p>
    <p>
        Powered by the TMDB API, we provide a seamless way to discover new releases, find detailed information on your favorite shows, and keep up-to-date with the latest news in the entertainment world. Whether you’re looking for something to watch tonight or searching for a hidden gem, our app makes it easy to browse, explore, and enjoy your entertainment journey.
    </p>
    <p>
        Join us in the world of cinema and television, and let the magic of storytelling unfold at your fingertips.
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
            masonry.append(img)
        }
    })
    aboutContainer.append(masonry)
    about.append(aboutContainer)
}

// -------------Generating Content-------------
function contentGenerator(type, airing, upcoming) {
    getGenres(type)
    getTrendingMovies(type)
    getPlayingMovies(airing)
    // getPlayingMovies('tv/airing_today')
    getRatedMovies(type)
    getUpcomingMovies(upcoming)
    // getUpcomingMovies('tv/on_the_air')
    getPopularMovies(type)
}

// -------------Generating Banner Start-------------
const getPopularMovies = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/${type}/popular?${apiKey}&language=en-US&with_original_language=en`)
    let data = await response.json()
    console.log(data)
    createBanner(data)
    createAbout(data)
}

function createBanner(data) {
    const heroBanner = document.querySelector('.herobanner')
    // <p>${data.results[1].overview}</p>

    heroBanner.innerHTML = `
        <article class="heroleft">
            <h2 class="herotitle">${data.results[1].title || data.results[1].name}</h2>
            <div class="heropills">
            <a href="#">
            Watch More
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
            </a>
            </div>
            <img class="poster" src="https://image.tmdb.org/t/p/w1280/${data.results[1].backdrop_path}" alt="">
            </article>
            <article class="heroright">
            <h2 class="herotitle">${data.results[0].title || data.results[0].name}</h2>
            <div class="heropillsr">
            <a href="#">
            Watch More
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
            </a>
            </div>
            <img class="poster" src="https://image.tmdb.org/t/p/w1280/${data.results[0].backdrop_path}" alt="">
        </article>
    `
    const heropills = document.querySelector('.heropills')
    const heropillsr = document.querySelector('.heropillsr')
    const genreArr = data.results[1].genre_ids
    const genreArr2 = data.results[0].genre_ids
    genreArr.forEach(genre => {
        genresAll.forEach(g => {
            if (g.id == genre) {
                let pill = document.createElement('div')
                pill.classList.add('genrepill')
                pill.innerHTML = `<p>${g.name}</p>`
                fetch(`./img/${g.name}.svg`)
                    .then(res => res.ok && res.text())
                    .then(svg => {
                        pill.innerHTML += svg || 'Error'
                    })
                    heropills.append(pill)
            }
        })
    });
    genreArr2.forEach(genre => {
        genresAll.forEach(g => {
            if (g.id == genre) {
                let pill = document.createElement('div')
                pill.classList.add('genrepill')
                pill.innerHTML = `<p>${g.name}</p>`
                fetch(`./img/${g.name}.svg`)
                    .then(res => res.ok && res.text())
                    .then(svg => {
                        pill.innerHTML += svg || 'Error'
                    })
                    heropillsr.append(pill)
            }
        })
    });

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
let genresAll
const getGenres = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/genre/${type}/list?${apiKey}`)
    let data = await response.json()
    createGenreCards(data)
    genresAll = data.genres
}

function createGenreCards(genres) {
    const genresContainer = document.querySelector('.genres')
    const genreCard = document.querySelectorAll('.genre')
    genreCard.forEach(card => {
        card.remove()
    });

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

    let scrollInterval;
    let lastInteractionTime = Date.now();

    function autoScroll() {
        const currentScroll = genresContainer.scrollLeft;
        const maxScrollLeft = genresContainer.scrollWidth - genresContainer.clientWidth;

        if (currentScroll + genreWidth >= maxScrollLeft) {
            genresContainer.scrollLeft = 0;
        } else {
            genresContainer.scrollBy({ left: genreWidth, behavior: 'smooth' });
        }
    }

    function startAutoScroll() {
        if (!scrollInterval) {
            scrollInterval = setInterval(autoScroll, 1000);
        }
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }

    genresContainer.addEventListener('scroll', () => {
        lastInteractionTime = Date.now();
        stopAutoScroll();
        setTimeout(() => {
            if (Date.now() - lastInteractionTime >= 1000) {
                startAutoScroll();
            }
        }, 1000);
    });

    startAutoScroll();
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
const getTrendingMovies = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/trending/${type}/day?${apiKey}&language=en-US`)
    let data = await response.json()
    createCards(data, 'trendingmovies')
}

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
            createModal('movie', movie, movieFigure)
        } else if (movie.name) {
            console.log(movie.name);
            
            let movieFigure = document.createElement('figure')
            movieFigure.classList.add('card')
            movieFigure.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w185/${movie.poster_path}" alt="">
                <figcaption>${movie.name}</figcaption>
                <div class="stats">
                    <span class="stars">
                        <p>&#11088;</p>
                        <p>${movie.vote_average}</p>
                    </span>
                    <p>${movie.first_air_date}</p>
                </div>
            `
            section.append(movieFigure)
            createModal('tv', movie, movieFigure)
        }
    })
}

// -------------Generating Playing Cards Start-------------
const getPlayingMovies = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/${type}?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'playing')
}

// -------------Generating Playing Cards End-------------
// -------------Generating Rated Cards Start-------------
const getRatedMovies = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/${type}/top_rated?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'rated')
}

// -------------Generating Rated Cards End-------------
// -------------Generating Rated Cards Start-------------
const getUpcomingMovies = async (type) => {
    let response = await fetch(`https://api.themoviedb.org/3/${type}?${apiKey}&include_adult=false&language=en-US&page=1`)
    let data = await response.json()
    createCards(data, 'upcoming')
}

// getUpcomingMovies()
// -------------Generating Rated Cards End-------------

// -------------Generating Movie Info Start-------------
function createModal(type, movie, container) {
    const modal = document.querySelector('.modal')
    const modalContent = document.querySelector('.modal-content')

    container.onclick = () => {
        modal.style.display = 'block'
        getMovie(type, movie.id, modalContent)
    }
}

const getMovie = async (type, movieId, container) => {
    let response = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?${apiKey}&language=en-US`)
    let data = await response.json()
    console.log(data.tagline)
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