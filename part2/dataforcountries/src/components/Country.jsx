import { useEffect } from "react";
import { getCountryWeather } from '../services/countryServices'

const Country = ({ filteredCountries, countryInfo, setCountryInfo, capitalCountry, setCapitalCountry, countryWeatherInfo, setCountryWeatherInfo}) => {

    useEffect(() => {
        if (capitalCountry) {
            getCountryWeather(capitalCountry)
            .then(w => {
                setCountryWeatherInfo(w)
            })
        }
    }, [capitalCountry])    

    function clickShow (country) {
        setCountryInfo(country)
        setCapitalCountry(`${country.capital},${country.name.common}`)
    }

    function showAllCountries (countries) {
        return <>{countries.name.common}{" "}<button onClick={() => clickShow(countries)}>Show</button></>
    }    

    function oneCountry (country) {
            setCapitalCountry(`${country.capital},${country.name.common}`)
        return (
            <>
                <div>{country?.name?.common}</div>
                <div>Capital: {country?.capital}</div>
                <div>Area: {country?.area}</div>
                <div>
                    <div>Languages</div>
                    <ul>
                        {
                            Object.values(country?.languages).map((language, key) => (
                                <li key={key}>
                                    {language}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div>
                    <img src={Object.values(country?.flags)[0]} />
                </div>
                {
                    countryWeatherInfo ?
                        <>
                            <div>Weather in {country?.capital}</div>
                            <div>Temperature {Object.values(countryWeatherInfo?.main)[0] || {}}</div>
                            <img src={`https://openweathermap.org/img/wn/${Object.values(countryWeatherInfo?.weather[0])[3]}.png`}/>
                            <div>Wind: {Object.values(countryWeatherInfo?.wind)[0]} m/s</div>
                        </>
                        : ""
                }
            </>
        )
    }

    const filterCountriesDiv = filteredCountries?.map((country,i) =>
        <div key={i}>
            {filteredCountries.length === 1 ? oneCountry(country) : showAllCountries(country)}
        </div>)


    return (
        <div>
            <div>
                { filteredCountries.length > 10 ? "There are too many matches, try another input" : filterCountriesDiv }
            </div>
            <div>
                { countryInfo && filteredCountries.length > 1 ? oneCountry(countryInfo) : "" }
            </div>
        </div>
    );
};

export default Country;