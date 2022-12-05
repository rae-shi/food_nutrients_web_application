import * as model from './model.js';
import foodView from './views/foodView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
// import foodView from './views/foodView.js';

// const foodContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

const controlFoods = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    foodView.renderSpinner();

    // 1) loading receipt
    await model.loadFood(id);

    // 2) rendering receipt
    foodView.render(model.state.foodNutrients);
  } catch (err) {
    foodView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    // 1) get searched query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    // 3) render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) render new results
  resultView.render(model.getSearchResultsPage(goToPage));
  // 4) render new pagination buttons
  paginationView.render(model.state.search);
};

const init = function () {
  foodView.addHandlerRender(controlFoods);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
///////////////////////////////////////
