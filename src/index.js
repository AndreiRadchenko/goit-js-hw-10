import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import countriesListTemplate from './templates/countriesListTemplate.hbs';
import countrieTemplate from './templates/countrieTemplate.hbs';
import debounce from 'lodash.debounce';
// const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const NOTIFY_TIMEOUT = 2000; //ms
const FLAG_OFFSET = 34;

const inputRef = document.querySelector('#search-box');
const countriesListRef = document.querySelector('.country-list');
const countrieInfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onTextInput, DEBOUNCE_DELAY));
countriesListRef.addEventListener('click', onCountriesListClick);

function onTextInput({ target: { value } }) {
  value = value.trim();
  clearCountriesHTML();
  if (value === '') {
    return;
  }
  fetchCountries(value).then(drawCountries).catch(onResponseError);
}

function onCountriesListClick(event) {
  inputRef.value = event.target.textContent.slice(FLAG_OFFSET);
  inputRef.dispatchEvent(new Event('input'));
}

function drawCountries(countriesList) {
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
