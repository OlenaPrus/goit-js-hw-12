import axios from 'axios';

export async function fetchHits(query, currentPage, per_page) {
  const API_KEY = '42449001-9f730a509ed4c563c5fe29690';
  const BASE_URL = 'https://pixabay.com/api/';

  const url = `${BASE_URL}`;

  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: per_page,
    page: currentPage,
  };

  try {
    const response = await axios.get(url, { params });
    const { hits, totalHits } = response.data;
    return { hits, totalHits };
  } catch (error) {
    throw new Error('Failed to fetch hits from Pixabay API');
  }
}

export async function searchImg(q, page) {
  axios.defaults.baseURL = 'https://pixabay.com';

  return axios.get('/api/', {
    params: {
      key: '42449001-9f730a509ed4c563c5fe29690',
      q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 30,
    },
  });
}
