import { useEffect, useState } from 'react'
import { getAllCountries } from './services/countryServices'
import Search from './components/Search';
import Country from './components/Country';

function App() {
    const [countries, setCountries] = useState([]);
    const [countryInfo, setCountryInfo] = useState()
    const [countryWeatherInfo, setCountryWeatherInfo] = useState()
    const [searchCountry, setSearchCountry] = useState(null);

    useEffect(() => {
        getAllCountries()
            .then(countriesData => {
            setCountries(countriesData)
        })   
    }, [])    
    
    const searchHandler = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setSearchCountry(value)
        setCountryInfo("")
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
                    countryWeatherInfo={countryWeatherInfo} 
                    setCountryWeatherInfo={setCountryWeatherInfo}
                /> 
            : "" 
        }
    </>
  )
}

export default App
