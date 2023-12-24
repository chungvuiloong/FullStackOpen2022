import { useEffect, useState } from 'react'
import { getAllCountries, getCountryWeather } from './services/countryServices'
import Search from './components/Search';
import Country from './components/Country';
import Weather from './components/Weather'

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

  return (
    <>
        <Search searchHandler={searchHandler} />
        { 
            countries && searchCountry ? 
                <Country 
                    filteredCountries={filteredCountries} 
                    countryInfo={countryInfo} 
                    setCountryInfo={setCountryInfo}
                    capitalCountry={capitalCountry}
                     setCapitalCountry={setCapitalCountry}
                /> 
            : "" 
        }
        {
            !countryWeatherInfo ? 
                ""
                    : 
                <Weather countryWeatherInfo={countryWeatherInfo}  />
        }
    </>
  )
}

export default App
