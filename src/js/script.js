
import movieTpl from '../templates/movie.handlebars'

const BASE_URL = 'http://localhost:3000';

const elements = {
    tableEl: document.querySelector(".movies-table"),
    movieTplEl: document.querySelector(".movie-tpl"),
    titleInputEl: document.querySelector("#title"),
    genreInputEl: document.querySelector("#genre"),
    directorInputEl: document.querySelector("#director"),
    yearInputEl: document.querySelector("#year"),
    createBtnEl: document.querySelector(".create-movie-btn"),
}


function onCreateBtnClick() {

    const dataObj = {
        title: elements.titleInputEl.value,
        genre: elements.genreInputEl.value,
        director: elements.directorInputEl.value,
        year: elements.yearInputEl.value,
    }
    elements.titleInputEl.value = "";
    elements.genreInputEl.value = "";
    elements.directorInputEl.value = "";
    elements.yearInputEl.value = "";

    const markup = movieTpl([dataObj]);
    elements.movieTplEl.insertAdjacentHTML("beforebegin", markup)
    createMovie(dataObj);
}

async function getMovie(id) {
    try {
        const movie = await fetch(`${BASE_URL}/movies/${id}`);
        const parsedMovie = await movie.json();
        return parsedMovie;
    } catch(error){
        console.log(error)
    }
    
}

async function createMovie(movieInfo) {
    makeFetchFunction(movieInfo, "POST", "")
}

async function deleteMovie(event) {
    const id = event.target.dataset.id;
    try {
        const updatedMovie = await fetch(`${BASE_URL}/movies/${id}`, {method: "DELETE"});
        const parsedMovie = await updatedMovie.json();

        const elemToDelete = event.target.parentNode.parentNode;
        elemToDelete.remove()

        return parsedMovie;
    } catch(error){
        console.log(error)
    }
    
}

async function updateMovie(event) {
    const id = event.target.dataset.id;
    const parentElem = event.target.parentNode.parentNode;
    const movieData = await getMovie(id);

    parentElem.innerHTML = `
        <td><input type="text" class="input" id="title-edit" placeholder="title" required value="${movieData.title}"></td>
        <td><input type="text" class="input" id="genre-edit" placeholder="genre" required value="${movieData.genre}"></td>
        <td><input type="text" class="input" id="director-edit" placeholder="director" required value="${movieData.director}"></td>
        <td><input type="text" class="input" id="year-edit" placeholder="year" required value="${movieData.year}"></td>
        <td><button class="create-movie-btn change-movie-btn material-symbols-outlined">done</button></td>
    `;

    const editTitleEl = document.querySelector("#title-edit");
    const editGenreEl = document.querySelector("#genre-edit");
    const editDirectorEl = document.querySelector("#director-edit");
    const editYearEl = document.querySelector("#year-edit");
    const changeBtn = document.querySelector(".change-movie-btn");

    changeBtn.addEventListener("click", ()=>{
        const dataObj = {
            title: editTitleEl.value,
            genre: editGenreEl.value,
            director: editDirectorEl.value,
            year: editYearEl.value,
        }

        makeFetchFunction(dataObj, "PATCH", id);
        const markup = movieTpl([dataObj])
        parentElem.innerHTML = markup;

    })
    

}

async function renderMovies() {
    try{
        const movies = await fetch(`${BASE_URL}/movies/`);
        const parsedMovies = await movies.json();
        const markup = movieTpl(parsedMovies);
        elements.movieTplEl.insertAdjacentHTML("beforebegin", markup);
    } catch(error){
        console.log(error)
    }
    
}

async function makeFetchFunction(dataObj, crudFn, id) {
    try {
        const options = {
            method: crudFn,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataObj)
        }
        
        const updatedMovie = await fetch(`${BASE_URL}/movies/${id}`, options);
        const parsedMovie = await updatedMovie.json();
        return parsedMovie; 
    } catch(error){
        console.log(error)
    }
    
}

window.addEventListener("click", (event)=>{
    if(event.target.dataset.type === 'delete-btn') {
        deleteMovie(event);
    } else if (event.target.dataset.type === "edit-btn") {
        updateMovie(event);
    } 
})

renderMovies();
elements.createBtnEl.addEventListener("click", onCreateBtnClick);