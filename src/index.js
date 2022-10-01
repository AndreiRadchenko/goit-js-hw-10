import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import countriesListTemplate from './templates/countriesListTemplate.hbs';
import countrieTemplate from './templates/countrieTemplate.hbs';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const NOTIFY_TIMEOUT = 2000; //ms

inputRef = document.querySelector('#search-box');
countriesListRef = document.querySelector('.country-list');
countrieInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onTextInput, DEBOUNCE_DELAY));

function onTextInput({ target: { value } }) {
  value = value.trim();
  if (value === '') {
    clearCountriesHTML();
    return;
  }
  fetchCountries(value).then(drawCountries).catch(onResponseError);
}

function drawCountries(countriesList) {
  clearCountriesHTML();
  if (countriesList.length > 10) {
    Notify.info(`Too many matches found. Please enter a more specific name`, {
      timeout: NOTIFY_TIMEOUT,
    });
  } else if (countriesList.length > 1) {
    countriesListRef.insertAdjacentHTML(
      'beforeend',
      countriesListTemplate(countriesList)
    );
  } else if (countriesList.length === 1) {
    countriesListRef.insertAdjacentHTML(
      'beforeend',
      countrieTemplate(countriesList[0])
    );
  }
}

function onResponseError(error) {
  clearCountriesHTML();
  if (error.message === '404') {
    Notify.failure(`Oops, there is no country with that name`, {
      timeout: NOTIFY_TIMEOUT,
    });
    return;
  }
  Notify.failure(`Response error: ${error}`, {
    timeout: NOTIFY_TIMEOUT,
  });
}

function clearCountriesHTML() {
  countriesListRef.innerHTML = '';
  countrieInfoRef.innerHTML = '';
}
