import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { searchImg } from './js/pixabay-api';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const galleryBox = document.querySelector('.gallery-box');
const loaderTop = document.querySelector('.loader-top');
const loaderBottom = document.querySelector('.loader-bottom');
const input = document.querySelector('input');
const loadImg = document.querySelector('.load-image');

let query;
let page;
let maxPage;
let per_page = 15;

const lightbox = new SimpleLightbox('.gallery a', {
  nav: true,
  captionDelay: 250,
  captionsData: 'alt',
  close: true,
  enableKeyboard: true,
  docClose: true,
});

form.addEventListener('submit', onSubmit);
loadImg.addEventListener('click', loadMore);

async function onSubmit(event) {
  event.preventDefault();
  loaderTop.style.display = 'block';
  loadImg.style.display = 'none';
  page = 1;
  query = event.target.elements.search.value.trim();

  if (!query) {
    gallery.innerHTML = '';
    iziToast.info({
      position: 'topRight',
      message: 'Error enter any symbols',
    });
    loaderTop.style.display = 'none';
    return;
  }

  try {
    const {
      data: { hits, totalHits },
    } = await searchImg(query, page);

    if (hits.length > 0) {
      loaderTop.style.display = 'none';
      gallery.innerHTML = renderImg(hits);
      lightbox.refresh();
      iziToast.success({
        position: 'topRight',
        message: `We found ${totalHits} photos`,
      });
      loadImg.style.display = 'block';
    } else {
      gallery.innerHTML = '';
      iziToast.error({
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    }

    if (totalHits <= per_page) {
      loadImg.style.display = 'none';
    }
  } catch (error) {
    console.log('Error');
  } finally {
    loaderTop.style.display = 'none';
    event.target.reset();
  }
}

function renderImg(hits = []) {
  return hits.reduce((html, hit) => {
    return (
      html +
      `<li class="gallery-item">
        <a href=${hit.largeImageURL}>
          <img class="gallery-img" src ='${hit.webformatURL}' alt='${hit.tags}'/>
        </a>
        <div class="gallery-text-box">
          <p>Likes: <span class="text-value">${hit.likes}</span></p>
          <p>views: <span class="text-value">${hit.views}</span></p>
          <p>comments: <span class="text-value">${hit.comments}</span></p>
          <p>downloads: <span class="text-value">${hit.downloads}</span></p>
      </div>
      </li>`
    );
  }, '');
}

async function loadMore(event) {
  loaderBottom.style.display = 'block';
  loadImg.style.display = 'none';
  const listItem = document.querySelector('.gallery-item:first-child');
  const itemHeight = listItem.getBoundingClientRect().height;

  try {
    page += 1;

    const {
      data: { hits, totalHits },
    } = await searchImg(query, page);

    maxPage = Math.ceil(totalHits / per_page);

    loadImg.style.display = 'block';
    gallery.insertAdjacentHTML('beforeend', renderImg(hits));
    lightbox.refresh();

    if (page === maxPage) {
      loadImg.style.display = 'none';
      return iziToast.info({
        position: 'topRight',
        message: `We're sorry, but you've reached the end of search results.`,
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderBottom.style.display = 'none';
    window.scrollBy({
      top: 2 * itemHeight,
      behavior: 'smooth',
    });
  }
}
