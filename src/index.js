import Notiflix from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.form');
const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let page = 1;
btn.addEventListener('click', onBtnClick);
function onBtnClick(event) {
    event.preventDefault();
    page = 1;
    gallery.innerHTML = '';
    const name = input.value.trim();
    if (name !== '') {
        pixabay(name);
    } else {
        btnLoadMore.style.display = 'none';
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
 
}

btn.addEventListener('click', onBtnMoreClick)
function onBtnMoreClick() {
    const name = input.value.trim();
    page +=1;
    pixabay(name,page)
}
async function pixabay(name, page) {
    const url = 'https://pixabay.com/api/';
    const options = {
        params: {
            key: '33982710-8c3e65337690b3022ecdda59f',
            q: name,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: page,
            per_page: 40,
        },
    };
    try {
        const response = await axios.get(url, options);
       notification(
            response.data.hits.length,
            response.data.totalHits
        );
        createMarkup(response.data.hits);
    }
    catch (error) {
        console.log(error);
    }

}

function createMarkup(arr) {
    const markup = arr.map(item =>
       `
      <a class="photo" href="${item.largeImageURL}">
        <div class="photo-card">
          <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes:${item.likes}</b></p>
            <p class="info-item"><b>Views:${item.views}</b></p>
            <p class="info-item"><b>Comments:${item.comments}</b></p>
            <p class="info-item"><b>Downloads:${item.downloads}</b></p>
          </div>
        </div>
      </a>
    `
  ).join("");
  gallery.insertAdjacentHTML("beforeend", markup);
  simpleLightbox.refresh();
   
}

const simpleLightbox = new SimpleLightbox('.gallery a', { 
    captionsData: 'alt',
    captionDelay:250,
});
 
function notification(length, totalHits) {
    if (length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }
    if (page === 1) {
        btnLoadMore.style.display = "flex";
         Notiflix.Notify.success("Hooray! We found ${totalHits} images");
        return;
    }
    if (length < 40) {
        btnLoadMore.style.display = "none";
         Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        return;
    }
}