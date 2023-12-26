import { useState, useEffect } from 'react';
import { getCountryWeather } from '../services/countryServices'

const Weather = ({ country }) => {
    const [countryWeatherInfo, setCountryWeatherInfo] = useState()
    
    if (country) {
        useEffect(() => {
            getCountryWeather(`${country.capital},${country.name.common}`)
            .then(w => {
                setCountryWeatherInfo(w)
            })
        }, [country])    
    }

    if (!countryWeatherInfo) {
        return `Loading weather data`
    }

    return (
        <>
            <div>Weather in {country?.capital}</div>
            <div>Temperature {Object.values(countryWeatherInfo?.main)[0] || {}} celsius</div>
            <img src={`https://openweathermap.org/img/wn/${Object.values(countryWeatherInfo?.weather[0])[3]}.png`}/>
            <div>Wind: {Object.values(countryWeatherInfo?.wind)[0]} m/s</div>
        </>
    );
};

export default Weather;