import { useEffect, useState } from 'react'
import { getAllCountries, getCountryWeather } from './services/countryServices'
import Search from './components/Search';
import Country from './components/Country';
import Weather from './components/Weather'
import countryDetails from './components/CountryDetails';

function App() {
    const [countries, setCountries] = useState([]);
    const [countryInfo, setCountryInfo] = useState()
    const [countryWeatherInfo, setCountryWeatherInfo] = useState()
    const [capitalCountry, setCapitalCountry] = useState()
    const [searchCountry, setSearchCountry] = useState(null);

    useEffect(() => {
        getAllCountries()
            .then(countriesData => {
            setCountries(countriesData)
        })
    }, [])    

    useEffect(() => {
        if (capitalCountry) {
            getCountryWeather(capitalCountry)
            .then(w => {
                setCountryWeatherInfo(w)
            })
        }
    }, [capitalCountry, setCountryWeatherInfo])    
    
    const searchHandler = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearchCountry(value)
        setCountryInfo("")
        setCountryWeatherInfo("")
        setCapitalCountry("")
    }

    const filteredCountries = countries.filter((country) =>
        country?.name?.common?.toLowerCase()
            .includes(searchCountry?.toLowerCase())
    );

    function clickShow (country) {
        setCountryInfo(country)
        setCapitalCountry(`${country.capital},${country.name.common}`)
    }

    function showAllCountries (countries) {
        return <>{countries.name.common}{" "}<button onClick={() => clickShow(countries)}>Show</button></>
    }    

    const allCountries = filteredCountries?.map((country,i) =>
        <div key={i}>
            {filteredCountries.length === 1 ? countryDetails(country) : showAllCountries(country)}
        </div>)

  return (
    <>
        <Search searchHandler={searchHandler} />
        { filteredCountries.length > 10 ?  "There are too many matches, try another input" : allCountries }
        {
            !countryWeatherInfo ? 
                ""
                    : 
                <> 
                    {countryDetails(countryInfo)}
                    <Weather countryWeatherInfo={countryWeatherInfo}  />
                </>
        }
    </>
  )
}

export default App
