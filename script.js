const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=02a3e5a378484e53f866ceda1701b03c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=02a3e5a378484e53f866ceda1701b03c&query=';

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');

returnMovies(APILINK);

function watchTrailer(url) {
    const modal = document.getElementById('trailerModal');
    const iframe = document.getElementById('trailerFrame');
    iframe.src = url;
    modal.style.display = "block";

    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
        iframe.src = "";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            iframe.src = "";
        }
    }
}

function returnMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(function(data) {
            console.log(data.results);
            data.results.forEach(element => {
                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'card');

                const div_row = document.createElement('div');
                div_row.setAttribute('class', 'row');

                const div_column = document.createElement('div');
                div_column.setAttribute('class', 'column');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image');

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');

                title.innerHTML = `${element.title}`;
                image.src = IMG_PATH + element.poster_path;

                const center = document.createElement('div');
                center.setAttribute('class', 'center');

                const trailerButton = document.createElement('button');
                trailerButton.innerHTML = 'Watch Trailer';
                trailerButton.onclick = () => fetchTrailer(element.id);

                const downloadLink = document.createElement('a');
                downloadLink.href = `path/to/movie/${element.id}.mp4`;
                downloadLink.download = '';
                downloadLink.innerHTML = 'Download Movie';

                center.appendChild(image);
                div_card.appendChild(center);
                div_card.appendChild(title);
                div_card.appendChild(trailerButton);
                div_card.appendChild(downloadLink);
                div_column.appendChild(div_card);
                div_row.appendChild(div_column);

                main.appendChild(div_row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function fetchTrailer(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=02a3e5a378484e53f866ceda1701b03c`)
        .then(res => res.json())
        .then(data => {
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                watchTrailer(`https://www.youtube.com/embed/${trailer.key}`);
            } else {
                alert('Trailer not available');
            }
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    main.innerHTML = '';

    const searchItem = search.value;

    if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = '';
    }
});