import axios from 'axios'
const baseUrl = `https://studies.cs.helsinki.fi/restcountries/api`;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY

async function getAllCountries () {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

async function getCountryWeather () {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=georgia,europe&appid=${WEATHER_API_KEY}`)
    return request.then(response => response.data)
}

export { getAllCountries, getCountryWeather }