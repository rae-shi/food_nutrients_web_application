import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  foodNutrients: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

export const loadFood = async function (id) {
  try {
    const data = await getJSON(
      `${API_URL}food/${id}?nutrients=208&nutrients=203&nutrients=204&nutrients=205&nutrients=291&nutrients=269&nutrients=301&nutrients=303&nutrients=306&nutrients=307&nutrients=328&nutrients=606&nutrients=695&nutrients=601&api_key=zsAOsFaartSbBnTqdjd6pHwetQJCjnXIyrukejdd`
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
    };
    console.log(state.foodNutrients);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(
      //   `${API_URL}foods/search?query=${query}&dataType=Foundation&api_key=zsAOsFaartSbBnTqdjd6pHwetQJCjnXIyrukejdd`

      `${API_URL}foods/search?query=${query}&dataType=Foundation,Branded&pageSize=200&sortBy=dataType.keyword&sortOrder=desc&api_key=zsAOsFaartSbBnTqdjd6pHwetQJCjnXIyrukejdd`
    );
    state.search.results = data.foods.map(food => {
      return {
        id: food.fdcId,
        img: require('../img/superfoods.png'),
        dataType: food.dataType,
        title: food.description,
        publicationDate: food.publicationDate,
        foodNutrients: food.foodNutrients,
      };
    });
    // console.log(state.search.results);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// loadSearchResults('cheddar cheese');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
