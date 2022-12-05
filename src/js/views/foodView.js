import View from './View.js';
// import icons from 'url:../img/icons.svg'
import icons from 'url:../../img/icons.svg';

export class foodView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that food. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _generateMarkup() {
    return `
      <figure class="food__fig">
        <img src="${this._data.img}" alt="${
      this._data.title
    }" class="food__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-text">publication date &nbsp </span>
          <span class="recipe__info-text"> </span>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.publicationDate
          }</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">100 </span>
          <span class="recipe__info-text">g</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated">
          
        </div>
        <button class="btn--round">
          <svg class="">
            <use href="${icons}#icon-bookmark-fill"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Food Nutrients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.foodNutrients
          .map(nut => {
            return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${parseFloat(nut.amount).toFixed(
                2
              )}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${nut.nutrient.unitName}</span>
                ${nut.nutrient.name}
              </div>
            </li>
          `;
          })
          .join('')}
      </div>

      <div id= "FoundationFoods " class="recipe__directions">
        <h2 class="heading--2">More info</h2>
        <p class="recipe__directions-text">
        fill sth
          <span class="recipe__publisher">${
            this._data.dataType
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="https://fdc.nal.usda.gov/index.html"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }
}

export default new foodView();
