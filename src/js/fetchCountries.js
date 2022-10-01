const BASE_URL = 'https://restcountries.com/v3.1/name/';
const PARAM_FILTER = '?fields=flag,name,capital,population,languages';

export function fetchCountries(name) {
  return fetch(BASE_URL + name + PARAM_FILTER)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(response => response);
}
