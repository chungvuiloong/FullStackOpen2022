import React from 'react';

const Weather = ({ countryWeatherInfo }) => {

    return (
        <>
            {/* <div>Weather in {capitalCountry}</div> */}
            <div>Temperature {Object.values(countryWeatherInfo?.main)[0] || {}} celsius</div>
            <img src={`https://openweathermap.org/img/wn/${Object.values(countryWeatherInfo?.weather[0])[3]}.png`}/>
            <div>Wind: {Object.values(countryWeatherInfo?.wind)[0]} m/s</div>
        </>
    );
};

export default Weather;