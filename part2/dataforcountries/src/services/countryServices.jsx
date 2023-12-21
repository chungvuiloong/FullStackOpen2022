import axios from 'axios'
const baseUrl = `https://studies.cs.helsinki.fi/restcountries/api`;

async function getAllCountries () {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

export { getAllCountries }