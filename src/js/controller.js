import * as model from './model.js';
import foodView from './views/foodView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addFoodView from './views/addFoodView.js';

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

    // 0) update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) loading receipt
    await model.loadFood(id);

    // 2) rendering receipt
    foodView.render(model.state.foodNutrients);

    // // test\

    // controlServings();
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

const controlServings = function (newServings) {
  // update the recipe servings
  model.updateServings(newServings);

  // update the food view
  // foodView.render(model.state.foodNutrients);
  foodView.update(model.state.foodNutrients);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.foodNutrients.bookmarked)
    model.addBookmark(model.state.foodNutrients);
  else model.deleteBookmark(model.state.foodNutrients.id);

  // 2) update food view
  foodView.update(model.state.foodNutrients);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddFood = async function (newFood) {
  // console.log(newFood);

  // upload the new food data
  try {
    await model.uploadFood(newFood);
  } catch (err) {
    console.error(err);
    addFoodView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  foodView.addHandlerRender(controlFoods);
  foodView.addHandlerUpdateServings(controlServings);
  foodView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addFoodView.addHandlerUpload(controlAddFood);
};
init();
///////////////////////////////////////
