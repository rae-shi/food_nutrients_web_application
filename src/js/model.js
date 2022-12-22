import { async } from 'regenerator-runtime';
import { API_URL, PER_SERVING, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  foodNutrients: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadFood = async function (id) {
  try {
    const data = await getJSON(
      `${API_URL}food/${id}?nutrients=208&nutrients=203&nutrients=204&nutrients=205&nutrients=291&nutrients=269&nutrients=301&nutrients=303&nutrients=306&nutrients=307&nutrients=328&nutrients=606&nutrients=695&nutrients=601&api_key=${KEY}`
    );
    const { foodNutrients } = data;
    // why do we have state here
    state.foodNutrients = {
      id: data.fdcId,
      img: require('../img/superfoods.png'),
      dataType: data.dataType,
      title: data.description,
      publicationDate: data.publicationDate,
      foodNutrients: data.foodNutrients,
      servings: PER_SERVING,
    };
    console.log(state.foodNutrients);
    // console.log();

    if (state.bookmarks.some(bookmark => bookmark.id == id))
      state.foodNutrients.bookmarked = true;
    else state.foodNutrients.bookmarked = false;

    // console.log(state.foodNutrients);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(
      `${API_URL}foods/search?query=${query}&dataType=Foundation,Branded&pageSize=200&sortBy=dataType.keyword&sortOrder=desc&api_key=${KEY}`
    );
    state.search.results = data.foods.map(food => {
      return {
        id: food.fdcId,
        img: require('../img/superfoods.png'),
        dataType: food.dataType,
        title: food.description,
        publicationDate: food.publicationDate,
        foodNutrients: food.foodNutrients,
        servings: PER_SERVING,
      };
    });
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.foodNutrients.foodNutrients.forEach(fo => {
    fo.amount = fo.amount * (newServings / state.foodNutrients.servings);
  });
  state.foodNutrients.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (food) {
  // add bookmark
  state.bookmarks.push(food);

  // mark current food as bookmark
  if (food.id === state.foodNutrients.id) state.foodNutrients.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current food as NOT bookmark
  if (id === state.foodNutrients.id) state.foodNutrients.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadFood = async function (newFood) {
  try {
    const nutrients = Object.entries(newFood)
      .filter(entry => entry[0].startsWith('foodNutrient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error('Wrong format! Please use the correct format');

        const [amount, unit, description] = ingArr;

        return { amount: amount ? +amount : null, unit, description };
      });

    const food = {
      fdcIds: +newFood.fdcIds,
      title: newFood.title,
      dataType: newFood.dataType,
      img: newFood.img,
      publicationDate: +newFood.addedDate,
      servings: +newFood.servings,
      nutrients,
      // format: 'abridged',
    };
    const data = await sendJSON(`${API_URL}foods?api_key=${KEY}`, food);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
