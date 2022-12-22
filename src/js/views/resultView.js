import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class resultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No foods found for your query! Please try again!';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
