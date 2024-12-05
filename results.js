const API_KEY = "api_key=daf788f2ab38afabc8b5ea0ee12373da";
const BASE_URL = "https://api.themoviedb.org/3";
const searchResultsSection = document.querySelector('.search-results');
const searchTermSpan = document.getElementById('search-term');

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

if (query) {
    searchTermSpan.textContent = query.replace(/\+/g, ' ');
    loadSearchResults(query);
} else {
    searchResultsSection.innerHTML = '<p>No se proporcionó un término de búsqueda.</p>';
}

async function loadSearchResults(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/multi?${API_KEY}&query=${query}&include_adult=false&language=es&page=1`);
        const data = await response.json();
        createSearchCards(data);
    } catch (error) {
        console.error('Error cargando resultados de búsqueda:', error);
    }
}

function createSearchCards(data) {
    searchResultsSection.innerHTML = '';
    if (data.results.length === 0) {
        searchResultsSection.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    data.results.forEach(result => {
        if (result.title && result.poster_path) {
            const card = document.createElement('figure');
            card.classList.add('card');
            card.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w185/${result.poster_path}" alt="${result.title}">
                <figcaption>${result.title}</figcaption>
            `;
            searchResultsSection.append(card);
        }
    });
}
